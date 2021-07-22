const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

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

router.post("/", (req, res, next) => {
    // console.log(req.url);
    // console.log(req.baseUrl);
    // console.log(req.originalUrl);
    // console.log(req.query);
    const resData = {};
    const email = req.body.email;

    // const hashedPassword = await bcrypt.hash(password, 12);
    // const isowner = await bcrypt.compare(password, hashedPassword);
    // const password = req.body.password;
    const query = connection.query(
        `select * from user where email="${email}" LIMIT 1`,
        (err, rows) => {
            if (err) throw err;
            //중복확인
            if (rows.length) {
                resData.state = "repeat";
                return res.status(200).json("OK");
            }
            const query = connection.query(
                `insert into user set ?`,
                req.body,
                (err, rows) => {
                    if (err) throw err;
                    //정상 회원가입
                    resData.id = rows.insertId;
                }
            );
            resData.email = email;
            resData.state = "ok";
            return res.status(201).json(resData);
        }
    );

    // const alreadyExist = await connection.query(`SELECT * FROM USER WHERE EMAIL=${email} LIMIT 1`);
    // if (alreadyExist) throw new CustomError('router post error', 'user resource');
});

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
