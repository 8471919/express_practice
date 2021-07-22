var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var router = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// const customLogger = (req, res, next) => {
//     const method = req.method;
//     const url = req.url;
//     // console.time();

//     // console.timeEnd();
//     console.log(`${method} ${url} time : abc`);
//     next();
// };

// app.use(customLogger);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//     console.log("여기서부터는 router 코드입니다.");
//     // next(new Error("에러 강제 발생"));
//     next();
// }, router);
app.use(router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
