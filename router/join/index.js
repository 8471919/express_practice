const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "7890",
    database: "jsman",
});

connection.connect();

router.get("/", (req, res, next) => {
    res.render("join.ejs");
});

router.post("/", (req, res, next) => {
    const body = req.body;
    const email = body.email;
    const name = body.name;
    const password = body.password;

    const sql = { email: email, name: name, pw: password };

    const query = connection.query(
        "insert into user set ?",
        sql,
        (err, rows) => {
            if (err) throw err;
            else res.render("welcome.ejs", { name: name, id: rows.insertId });
        }
    );
});

module.exports = router;
