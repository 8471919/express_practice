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

//done을 할 경우 serialize라는 메소드를 불러서 실행해줄 것을 찾는데
//그것에 대한 처리
//즉, done에서 fail이 아닌 경우, serialize에 등록한 방법대로 처리가 이루어짐.
//session값 저장, 이후 deserializeUser에서 이 값을 가져다가 쓴다.
passport.serializeUser((user, done) => {
    console.log("passport session save : ", user.id);
    //strategy콜백함수에서 done으로, false를 주지않고, 객체를 담아전달했을 때,
    //그 값을 받아서 사용(user.id로 접근하여 사용가능), session에 저장.
    done(null, user.id);
});

//session에서 id값을 뽑아서 어떠한 처리를 함
//모든 page요청시, deserializeUser를 거치면서 session에 있는 값을 뽑아서
//필요한 각각의 페이지에 전달.
passport.deserializeUser((id, done) => {
    console.log("passport session get id : ", id);
    done(null, id);
});

router.get("/", (req, res, next) => {
    let msg;
    const errMsg = req.flash("error");
    if (errMsg) msg = errMsg;
    res.render("join.ejs", { message: msg });
});

//passport에 local-join이라는 이름의 Strategy를 만든다.
//라우팅시 local-join이라는 strategy를 불러서 사용하는 방식.

passport.use(
    "local-join",
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
                        console.log("existed user");
                        return done(null, false, {
                            //false를 남기면 failureRedirect로 넘어감
                            message: "your email is already used",
                        });
                    } else {
                        //정상적인 처리
                        const sql = { email: email, pw: password, name: 123 };
                        const query = connection.query(
                            "insert into user set ?",
                            sql,
                            (err, rows) => {
                                if (err) throw err;
                                return done(null, {
                                    email: email,
                                    id: rows.insertId,
                                });
                            }
                        );
                    }
                }
            );
        }
    )
);

//post발생 시, authenticate함수가 실행.
//authenticate함수는 local-join이라는 strategy를 사용한다.
//실제 인증과 처리는 local-join안에서 처리되고,
//최종처리결과가 뒤의 객체로 넘어가게된다.
router.post(
    "/",
    passport.authenticate("local-join", {
        successRedirect: "/main", //redirect성공시 /main으로 이동
        failureRedirect: "/join", //redirect실패시 /join으로 이동
        failureFlash: true,
    })
);

// router.post("/", (req, res, next) => {
//     const body = req.body;
//     const email = body.email;
//     const name = body.name;
//     const password = body.password;

//     const sql = { email: email, name: name, pw: password };

//     const query = connection.query(
//         "insert into user set ?",
//         sql,
//         (err, rows) => {
//             if (err) throw err;
//             else res.render("welcome.ejs", { name: name, id: rows.insertId });
//         }
//     );
// });

module.exports = router;
