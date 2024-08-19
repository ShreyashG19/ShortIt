const { v4: uuidV4 } = require("uuid");
const USER = require("../models/user");
const { setUser } = require("../services/auth");
async function handleUserSignUp(req, res) {
    const { name, email, password } = req.body;
    await USER.create({
        name: name,
        email: email,
        password: password,
    });

    return res.redirect("/");
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await USER.findOne({ email, password });
    console.log(user);
    if (!user) {
        return res.render("login", {
            error: "invalid username or password",
        });
    }

    const sessionID = uuidV4();
    setUser(sessionID, user);
    res.cookie("uid", sessionID);
    return res.redirect("/");
}
module.exports = { handleUserSignUp, handleUserLogin };
