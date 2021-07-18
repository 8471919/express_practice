const express = require("express");
const router = express.Router();
const path = require("path");

//main page는 login이 될 때만(즉, 세션정보가 있을때만) 접근이 가능하게 하자.
router.get("/", (req, res, next) => {
    //req의 user라는 속성으로 deserialize의 id값에 접근 가능
    const id = req.user;
    if (!id) res.render("login.ejs");

    res.render("main.ejs", { id: id });
});

module.exports = router;
