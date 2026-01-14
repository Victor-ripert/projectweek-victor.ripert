const express = require('express');
const mysql = require('mysql2');
const db = require('../../config/db');
const bcryptjs = require('bcryptjs')
const { route } = require('./user');

const router = express.Router();

router.use(express.json())

module.exports = router;

router.get("/", (req, res) => {
    db.query(`SELECT * FROM user`, (err, result) => {
        if (err) throw err;
        return res.status(200).json({"users": result})
    })
})

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!id)
        return res.status(400).json({ msg: "Bad parameter" });
    db.query(`DELETE FROM user WHERE id = ${ id }`, (err, result) => {
        if (err) throw err;
        if (result.affectedRows < 1)
            return res.status(400).json({ msg: "Not found" });
        return res.status(200).json({ msg: `Successfully deleted record number: ${id}` })
    })
})