const express = require('express');
const db = require('../../config/db');
const dbPromise = db.promise();
const bcryptjs = require('bcryptjs')
const { route } = require('./transaction');
const { addRequestMeta } = require('next/dist/server/request-meta');
const { use } = require('react');

const router = express.Router();

router.use(express.json())

module.exports = router;

router.get("/", (req, res) => {
    db.query(`SELECT * FROM transaction`, (err, result) => {
        if (err) throw err;
        return res.status(200).json({"transactions": result})
    })
})

router.post("/", async (req, res) => {
    try {
        const {item_id, renter_id, lender_id, end_date} = req.body;
        if (!item_id || !renter_id || !lender_id || !end_date) {
          return res.status(400).json({ msg: 'Bad parameter' });
        }
        const [rows] = await dbPromise.query('SELECT 1 FROM transaction WHERE item_id = ? ', [item_id]);
        if (rows.length > 0) return res.status(400).json({ msg: "This item is already rented." });

        const timestamp_end_date = (new Date(end_date))
        const created_at = (new Date());
        const query = 'INSERT INTO transaction (created_at, item_id, renter_id, lender_id, end_date) VALUES (?, ?, ?, ?, ?)';
        await dbPromise.query(
            query,
            [created_at, item_id, renter_id, lender_id, timestamp_end_date]
        );
        return res.status(200).json({"created_at" : created_at, "item_id" : item_id, "renter_id":renter_id, "lender_id":lender_id, "end_date": end_date})
    } catch (err) {
        return res.status(500).json({ msg: 'Internal error', "reason": err });
    }
})

router.delete("/:item_id", async (req, res) => {
    try {
        const item_id = Number(req.params.item_id);
        const [rows] = await dbPromise.query('SELECT * FROM transaction WHERE item_id = ? ', [item_id]);
        if (rows.length == 0) return res.status(400).json({ msg: "This item isn't rented." });

        await dbPromise.query('DELETE FROM transaction WHERE item_id = ?', [item_id]);
        return res.status(200).json({msg: "Item deleted from transaction table"})
    } catch (err) {
        return res.status(500).json({ msg: 'Internal error', "reason": err });
    }
})

router.get("/rent/:renter_id", async (req, res) => {
    try {
        const renter_id = Number(req.params.renter_id);
        const [rows] = await dbPromise.query('SELECT * FROM transaction WHERE renter_id = ? ', [renter_id]);

        return res.status(200).json({"items" : rows})
    } catch (err) {
        return res.status(500).json({ msg: 'Internal error', "reason": err });
    }
})

router.get("/lend/:lender_id", async (req, res) => {
    try {
        const lender_id = Number(req.params.lender_id);
        const [rows] = await dbPromise.query('SELECT * FROM transaction WHERE lender_id = ? ', [lender_id]);

        return res.status(200).json({"items" : rows})
    } catch (err) {
        return res.status(500).json({ msg: 'Internal error', "reason": err });
    }
})
