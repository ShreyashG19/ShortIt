const express = require("express");
const path = require("path");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const { connectToMongoDb } = require("./connect");
const URL = require("./models/url");
const app = express();
const PORT = 8001;

connectToMongoDb("mongodb://localhost:27017/short-it")
    .then(() => {
        console.log("connected to DB");
    })
    .catch((error) => {
        console.log("MongoDB service :: connectToMongoDb :: error : ", error);
    });

//setting view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views")); //setting path of html files

app.use(express.urlencoded({ extended: false }));
app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render("home", {
        urls: allUrls,
        name: "shreyash",
    });
});

//setting routes
app.use("/url", urlRoute);
app.use("/", staticRoute);
app.get("/urls/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        {
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        }
    );
    return res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
    console.log("app is listening on port 8001");
});
