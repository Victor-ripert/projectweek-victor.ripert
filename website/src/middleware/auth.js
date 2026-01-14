const express = require('express')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.use((req, res, next) => {
    const usertoken = req.headers.authorization;
    if (!usertoken || !usertoken.startsWith('Bearer')) {
        return res.status(400).json({ msg: "No token, authorization denied" });
    }
    const token = usertoken.split(' ')[1];
    jwt.verify(token, process.env.SECRET, (err, result) => {
        if (err)
            return res.status(400).json({ msg: "Token is not valid" });
    })
    next();
})

module.exports = router;
