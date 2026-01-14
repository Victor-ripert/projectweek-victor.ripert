const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const bcryptjs = require('bcryptjs');
const db = require('../../config/db');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true}));

router.post('/', (req, res) => {
    const {email, password} = req.body;
    if (!email, !password) {
        return res.status(400).json({msg: "Bad Parameters"})
    }
    db.query(`SELECT * FROM user WHERE email = '${ email }';`, (err, result) => {
        if (err) throw err;
        if (result.length == 0) return res.status(400).json({msg: "Invalid Email adress"});
        bcryptjs.compare(password, result[0].password, (err, compare) => {
            if (err) throw err;
            if (compare) {
                const token = jwt.sign({id: result[0].id}, process.env.SECRET);
                return res.status(200).json({ "token": token });
            } else {
                return res.status(400).json({msg: "Invalid Credentials"});
            }
        })
        }
    )
})

module.exports = router;