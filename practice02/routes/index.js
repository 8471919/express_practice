var express = require("express");
var router = express.Router();
const main = require("./main/index");
const join = require("./join/index");

router.get("/", (req, res, next) => {
    res.render("index.ejs", { title: "Express" });
});

router.use("/main", main);
router.use("/join", join);

module.exports = router;
