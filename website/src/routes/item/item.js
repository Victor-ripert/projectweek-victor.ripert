const express = require('express')
// const jwt = require('jsonwebtoken')
const mysql = require('mysql2')
const db = require('../../config/db');
const { parse } = require('dotenv');
const { convertCompilerOptionsFromJson } = require('typescript');

const router = express.Router()
router.use(express.json())

router.get("/", (req, res) => {
    db.query('SELECT * FROM item;', (err, result) => {
        if (err) throw err;
        if (result.length == 0) return res.status(200).json({msg: "No item found"})
        return res.status(200).json({items: result});
    })
})

// router.get("/:id", (req, res) => {
//     const id = Number(req.params.id);
//     db.query(`SELECT * FROM item WHERE id = '${ id }'`, (err, result) => {
//         if (err) throw err;
//         if (!result[0]) return res.status(400).json({ msg: "Not found" });
//         return res.status(200).json({"id" : result[0].id, "title" : result[0].title, "description" : result[0].description,
//              "created_at" : result[0].created_at, "user_id" : result[0].user_id, "status": result[0].status});
//     })
// })

router.post("/", (req, res) => {
    const {title, description, user_id, status} = req.body;
    if (!title || !description || !user_id || !status) {
        return res.status(400).json({ msg: "Bad parameter" });
    }
    db.query(`SELECT COUNT(*) AS count FROM user WHERE id = '${ user_id }';`, (err, result) => {
        if (err) throw err;
        if (!result[0].count)
            return res.status(400).json({ msg: "Bad parameter" });
        });
    const created_at = (new Date());
    const query = 'INSERT INTO item (title, description, created_at, status, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, description, created_at, status, user_id], (err, result) => {
        if (err) throw err;
        res.status(200).json({"id" : result.insertId, "title" : title, "description" : description,
             "created_at" : created_at, "user_id" : user_id, "status": status});
    })
})

router.put("/:id", (req, res) => {
    const id = Number(req.params.id);
    const {title, description, status} = req.body;
    if (!title || !description|| !status) {
        return res.status(400).json({ msg: "Bad parameter" });
    }
    db.query(`UPDATE item SET title = '${ title }', description = '${ description }', status = '${ status }' WHERE id = ${ id }`, (err, result) => {
        if (err) throw err;
        db.query(`SELECT * FROM item WHERE id = ${ id }`, (err, result) => {
            if (err) throw err;
            return res.status(200).json({"id" : result[0].id, "title" : result[0].title, "description" : result[0].description,
                 "created_at" : result[0].created_at, "user_id" : result[0].user_id, "status" : result[0].status});
        })
    })
})

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    if (!id) {
        return res.status(400).json({ msg: "Bad parameter" });
    }
    db.query(`SELECT * FROM item WHERE id = '${ id }';`, (err, result) => {
        if (err) throw err;
        if (!result[0])
            return res.status(400).json({ msg: "Not found" });
        const query = `DELETE FROM item WHERE id = ${ id }`;
        db.query(query, (err, result) => {
        if (err) throw err;
            res.status(200).json({ msg: `Successfully deleted record number : ${ id }`, deteleted_item: result });
    })
    })
})

module.exports = router;