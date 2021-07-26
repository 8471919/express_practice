const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    let id;
    let name;
    if (req.user) {
        id = req.user.id;
        name = req.user.name;
    }
    res.render("index.ejs", { title: "Express", id, name });
});

module.exports = router;
