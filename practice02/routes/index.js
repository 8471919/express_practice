const express = require("express");
const router = express.Router();
const main = require("./main/index");
const join = require("./join/index");
const login = require("./login/index");

router.get("/", (req, res, next) => {
    res.render("index.ejs", { title: "Express" });
});

router.use("/main", main);
router.use("/join", join);
router.use("/login", login);

module.exports = router;
