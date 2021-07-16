var express = require("express");
var router = express.Router();
var path = require("path");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});

router.post("/result_post", (req, res, next) => {
    console.log(req.body.result);
    res.sendFile(path.join(__dirname + "/../public/pages/result.html"));
});

router.post("/fetch_result", (req, res, next) => {
    // console.log(req.body.result);
    let responseData = {};
    responseData.result = req.body.result;
    responseData.sure = "ok";
    res.json(responseData);
});

module.exports = router;
