const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "7890",
    database: "jsman",
});

router.get("/", (req, res, next) => {
    res.render("login.ejs");
});

router.post("/", (req, res, next) => {
    const resData = {};
    const email = req.body.email;
    const pw = req.body.pw;
    console.log(email, pw);

    const query = connection.query(
        `select * from user where email="${email}" LIMIT 1`,
        (err, rows) => {
            if (err) throw err;
            if (!rows.length) return res.status(200).json("OK");
            if (rows[0].PW === pw) {
                resData.email = email;
                return res.json(resData);
            }
            return res.json(resData);
        }
    );
});

module.exports = router;
