const express = require("express");
const app = express();

const router = require("./router/index");
const main = require("./router/main");
const email = require("./router/email");

// const bodyParser = require('body-parser');

app.listen(3000, () => {
    console.log("start! express server on port 3000");
});

app.set("view engine", "ejs");

app.use(express.static("public"));
//bodyParser대신
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));
app.use(router);
app.use("/main", main);
app.use("/email", email);
