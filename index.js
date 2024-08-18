//modules
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

//routes
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

//user modules
const URL = require("./models/url");

//methods
const { connectToMongoDb } = require("./connect");
const { restrictToLoggedInUserOnly } = require("./middlewares/user");

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
app.use(cookieParser());

//setting routes
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);
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
    if (entry.redirectURL) return res.redirect(entry.redirectURL);
    return res.json({ status: "something went wrong" });
});

app.listen(PORT, () => {
    console.log("app is listening on port 8001");
});

/*
getting all users
app.get("/test", async (req, res) => {
    const allUrls = await URL.find({});
    return res.render("home", {
        urls: allUrls,
        name: "shreyash",
    });
});

*/
