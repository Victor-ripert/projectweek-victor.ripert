const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bcryptjs = require('bcryptjs');
const db = require('../../config/db');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true}));

router.post("/", (req, res) => {
    const {email, lastname, firstname, password} = req.body;
    if (!email || !lastname || !firstname || !password) {
        return res.status(400).json({ msg: "Bad parameter" });
    }
    const date = (new Date());
    db.query(`SELECT COUNT(*) AS count FROM user WHERE email = '${ email }';`, (err, result) => {
        if (err) throw err;
        const count = result[0].count;
        if (count != 0)
            return res.status(400).json({ msg: "Account alredy exists" });
        else {
            bcryptjs.genSalt(12, (err, salt) => {
                if (err) throw err;
                bcryptjs.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    let query = 'INSERT INTO user (email, password, lastname, firstname, created_at) VALUES (?, ?, ?, ?, ?)'
                    db.query(query, [email, hash, lastname, firstname, date], (err, results, field) => {
                        if(err) throw err;
                        db.query(`SELECT * FROM user WHERE email = '${ email }'`, (err, id) => {
                            const token = jwt.sign({id: id[0].id}, process.env.SECRET);
                            return res.status(200).json({ "token": token });
                        })
                    })
                })
            })
        }
    })
})

module.exports = router;