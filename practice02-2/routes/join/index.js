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

connection.connect();

passport.serializeUser((user, done) => {
    console.log("passport session save : ", user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("passport session get user : ", user);
    done(null, user);
});

router.get("/", (req, res, next) => {
    res.render("join.ejs", { message: msg });
});

passport.use(
    "hansu-join",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "pw",
            passReqToCallback: true,
        },
        (req, email, pw, done) => {
            const query = connection.query(
                `select * from user where email="${email}"`,
                (err, rows) => {
                    if (err) return done(err);
                    if (rows.length) {
                        return done(null, false, {
                            email: email,
                            message: "이미 있는 이메일입니다.",
                        });
                    }
                    const sql = { email, pw, name: req.body.name };
                    const query = connection.query(
                        `insert into user set ?`,
                        sql,
                        (err, rows) => {
                            if (err) throw err;
                            return done(null, {
                                email,
                                id: rows.insertId,
                                name: req.body.name,
                                message: "회원가입에 성공했습니다!",
                            });
                        }
                    );
                }
            );
        }
    )
);

router.post("/", (req, res, next) => {
    passport.authenticate("hansu-join", (err, user, info) => {
        if (err) return res.status(500).json(err);
        if (!user) return res.status(401).json(info);
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json(user);
        });
    })(req, res, next);
});

// router.get(
//     "/",
//     (req, res, next) => {
//         console.log("join page의 1번 미들웨어.");
//         next();
//     },
//     (req, res, next) => {
//         console.log("join page의 2번 미들웨어.");
//         next();
//     },
//     (req, res, next) => {
//         res.render("join.ejs");
//     }
// );

// router.post("/", (req, res, next) => {
//     // console.log(req.url);
//     // console.log(req.baseUrl);
//     // console.log(req.originalUrl);
//     // console.log(req.query);
//     const resData = {};
//     const email = req.body.email;

//     // const hashedPassword = await bcrypt.hash(password, 12);
//     // const isowner = await bcrypt.compare(password, hashedPassword);
//     // const password = req.body.password;
//     const query = connection.query(
//         `select * from user where email="${email}" LIMIT 1`,
//         (err, rows) => {
//             if (err) throw err;
//             //중복확인
//             if (rows.length) {
//                 resData.state = "repeat";
//                 return res.status(200).json("OK");
//             }
//             const query = connection.query(
//                 `insert into user set ?`,
//                 req.body,
//                 (err, rows) => {
//                     if (err) throw err;
//                     //정상 회원가입
//                     resData.id = rows.insertId;
//                 }
//             );
//             resData.email = email;
//             resData.state = "ok";
//             return res.status(201).json(resData);
//         }
//     );

// const alreadyExist = await connection.query(`SELECT * FROM USER WHERE EMAIL=${email} LIMIT 1`);
// if (alreadyExist) throw new CustomError('router post error', 'user resource');
// });

// class CustomError extends Error {
//     constructor(errorName, errorContent) {}
// }

/* 
// router.js

router.route('/')
    .get(Controller.getAlluser)
    .post(Controller)
    .delete(Controller)
    .put(Controller);

// router.get();
// router.put();
// router.delete();
// router.post('/', Controller.createData);

// controller.js
let service;

export class Controller {
    static createData (req, res, next) {
        const id = req.body.id;
        const password = req.body.password;
        return await service.createData(id, password);        
    }
}

// service.js

class Service {
    static createData(id, password) {
        try{
            connection.query(`~~~ values`, [id, password]);
        }catch(error){
            connection.rollback();
        } finally {
            connection.commit();
        }
    }
}
 */

module.exports = router;
