const express = require("express");
const app = express();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("connect-flash");

const router = require("./router/index");

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
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//라우터
app.use(router);
