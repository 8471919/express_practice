const express = require("express");
const router = express.Router();
const path = require("path");
const mysql = require("mysql");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "7890",
    database: "jsman",
});

connection.connect();

passport.serializeUser((user, done) => {
    console.log("passport session save : ", user.id);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log("passport session get id : ", id);
    done(null, id);
});

router.get("/", (req, res, next) => {
    let msg;
    const errMsg = req.flash("error");
    if (errMsg) msg = errMsg;
    res.render("login.ejs", { message: msg });
});

passport.use(
    "local-login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        (req, email, password, done) => {
            const query = connection.query(
                `select * from user where EMAIL="${email}"`,
                (err, rows) => {
                    if (err) return done(err);
                    //유저 중복확인
                    if (rows.length) {
                        //정상적인 처리
                        return done(null, { email: email, id: rows[0].UID });
                    } else {
                        //오류
                        return done(null, false, {
                            message: "your login info is not found >.<",
                        });
                    }
                }
            );
        }
    )
);

//ajax를 사용했기 때문에 res값을 json으로 전달해주어야함.
router.post("/", (req, res, next) => {
    passport.authenticate("local-login", (err, user, info) => {
        if (err) res.status(500).json(err);
        if (!user) return res.status(401).json(info.message);

        req.logIn(user, (err) => {
            //정상적인 경우, serializeUser처리로 자연스럽게 이어지게 한다.
            if (err) return next(err);
            //user를 넘긴다.
            return res.json(user);
        });
    })(req, res, next); //authenticate가 반환하는 메소드가 있는데, 메소드에 인자를 넣어서 추가 처리
});

module.exports = router;
