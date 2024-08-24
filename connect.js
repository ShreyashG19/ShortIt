require("dotenv").config();
const mongoose = require("mongoose");

async function connectToMongoDb(url) {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = { connectToMongoDb };
