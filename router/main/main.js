const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res, next) => {
    //req의 user라는 속성으로 deserialize의 id값에 접근 가능
    console.log("main js loaded", req.user);
    const id = req.user;

    // res.send("<h1>hi friend1</h>");
    // res.sendFile(path.join(__dirname + "/../../public/main.html"));
    res.render("main.ejs", { id: id });
});

module.exports = router;
