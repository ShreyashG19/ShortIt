const express = require("express");
const urlRoute = require("./routes/url");
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

app.use(express.urlencoded({ extended: false }));
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
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
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
    console.log("app is listening on port 8001");
});
