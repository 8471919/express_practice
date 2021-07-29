const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "7890",
    database: "jsman",
});

connection.connect();

router.get("/list", (req, res, next) => {
    res.render("movie.ejs");
});

// 1. /movie , GET
router.get("/", (req, res, next) => {
    const responseData = {};

    const query = connection.query(
        "select title from movie",
        function (err, rows) {
            console.log(rows);
            if (err) throw err;
            if (rows.length) {
                responseData.result = 1;
                responseData.data = rows;
            } else {
                responseData.result = 0;
            }
            res.json(responseData);
        }
    );
});

// 2. /movie , POST
router.post("/", (req, res, next) => {
    const title = req.body.title;
    const type = req.body.type;
    const grade = req.body.grade;
    const actor = req.body.actor;

    const sql = { title, type, grade, actor };

    const query = connection.query(
        `insert into movie set ?`,
        sql,
        (err, rows) => {
            if (err) throw err;
            return res.json({ result: 1 });
        }
    );
});

// 3. /movie/:title , GET
router.get("/:title", (req, res, next) => {
    //위의 /:title의 title이 req.params에 들어간다.
    const title = req.params.title;
    console.log(title);
    const responseData = {};

    const query = connection.query(
        "select * from movie where title =?",
        [title],
        function (err, rows) {
            console.log(rows);
            if (err) throw err;
            if (rows[0]) {
                responseData.result = 1;
                responseData.data = rows;
            } else {
                responseData.result = 0;
            }
            res.json(responseData);
        }
    );
});

// router.post("/form", (req, res, next) => {
//     //get : req.param('email');
//     console.log(req.body.email);
//     // res.send("post response");
//     //res.send("<h1>welcome " + req.body.email + "</h1>");
//     res.render("email.ejs", { email: req.body.email });
// });

// router.post("/ajax", (req, res, next) => {
//     //json형태로 받기때문에 express.json()이 있어야 한다.
//     // console.log(req.body.email);

//     //check validation about input value => select db
//     // const responseData = { result: "ok", email: req.body.email };
//     // res.json(responseData);

//     const email = req.body.email;
//     const responseData = {};

// const query = connection.query(
//     'select name from user where email="' + email + '"',
//     function (err, rows) {
//         if (err) throw err;
//         if (rows[0]) {
//             responseData.result = "ok";
//             responseData.name = rows[0].name;
//         } else {
//             responseData.result = "none";
//             responseData.name = "";
//         }
//         res.json(responseData);
//         }
//     );
// });

module.exports = router;
