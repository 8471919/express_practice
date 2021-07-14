const express = require("express");
const app = express();
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "7890",
    database: "jsman",
});

connection.connect();

// const bodyParser = require('body-parser');

app.listen(3000, () => {
    console.log("start! express server on port 3000");
});

app.use(express.static("public"));
//bodyParser대신
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
    // res.send("<h1>hi friend1</h>");
    res.sendFile(__dirname + "/public/main.html");
});

app.get("/main", (req, res, next) => {
    // res.send("<h1>hi friend1</h>");
    res.sendFile(__dirname + "/public/main.html");
});

app.post("/email_post", (req, res, next) => {
    //get : req.param('email');
    console.log(req.body.email);
    // res.send("post response");
    //res.send("<h1>welcome " + req.body.email + "</h1>");
    res.render("email.ejs", { email: req.body.email });
});

app.post("/ajax_send_email", (req, res, next) => {
    //json형태로 받기때문에 express.json()이 있어야 한다.
    // console.log(req.body.email);

    //check validation about input value => select db
    // const responseData = { result: "ok", email: req.body.email };
    // res.json(responseData);

    const email = req.body.email;
    const responseData = {};

    const query = connection.query(
        'select name from user where email="' + email + '"',
        function (err, rows) {
            if (err) throw err;
            if (rows[0]) {
                responseData.result = "ok";
                responseData.name = rows[0].name;
            } else {
                responseData.result = "none";
                responseData.name = "";
            }
            res.json(responseData);
        }
    );
});
