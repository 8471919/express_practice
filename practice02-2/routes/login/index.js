const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "7890",
    database: "jsman",
});

// passport.serializeUser((user, done) => {
//     console.log("passport session save : ", user.id);
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     console.log("passport session get id : ", id);
//     done(null, id);
// });

passport.use(
    "hansu-login",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "pw",
            passReqToCallback: true,
        },
        (req, email, pw, done) => {
            const query = connection.query(
                `select * from user where email="${email}" LIMIT 1`,
                (err, rows) => {
                    if (err) return done(err);
                    if (!rows.length)
                        return done(null, false, {
                            email,
                            message: "해당 이메일은 존재하지 않습니다.",
                            state: "fail",
                        });
                    if (rows[0].PW === pw) {
                        return done(null, {
                            message: `반갑습니다! ${rows[0].NAME}님!`,
                            email,
                            id: rows[0].UID,
                            name: rows[0].NAME,
                        });
                    }
                    return done(null, false, {
                        message: "비밀번호가 다릅니다.",
                        state: "fail",
                    });
                }
            );
        }
    )
);

router.get("/", (req, res, next) => {
    res.render("login.ejs");
});

router.post("/", (req, res, next) => {
    passport.authenticate("hansu-login", (err, user, info) => {
        if (err) return res.status(500).json(err);
        if (!user) return res.status(401).json(info);
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json(user);
        });
    })(req, res, next);
});

// router.post("/", (req, res, next) => {
//     const resData = {};
//     const email = req.body.email;
//     const pw = req.body.pw;
//     console.log(email, pw);

//     const query = connection.query(
//         `select * from user where email="${email}" LIMIT 1`,
//         (err, rows) => {
//             if (err) throw err;
//             if (!rows.length) return res.status(200).json("OK");
//             if (rows[0].PW === pw) {
//                 resData.email = email;
//                 return res.json(resData);
//             }
//             return res.json(resData);
//         }
//     );
// });

module.exports = router;
