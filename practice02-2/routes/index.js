const express = require("express");
const router = express.Router();
const join = require("./join/index");
const login = require("./login/index");
const main = require("./main/index");
const logout = require("./logout/index");

router.get("/", (req, res, next) => {
    let id;
    let name;
    if (req.user) {
        id = req.user.id;
        name = req.user.name;
    }
    res.render("index.ejs", { title: "Express", id, name });
});

router.use("/join", join);
router.use("/login", login);
router.use("/main", main);
router.use("/logout", logout);

module.exports = router;
