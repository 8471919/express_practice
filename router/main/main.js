const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res, next) => {
    // res.send("<h1>hi friend1</h>");
    res.sendFile(path.join(__dirname + "/../../public/main.html"));
});

module.exports = router;
