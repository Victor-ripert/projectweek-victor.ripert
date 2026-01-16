const express = require('express');
const db = require('../../config/db');
const dbPromise = db.promise();
const bcryptjs = require('bcryptjs')
const { route } = require('./user');
const { addRequestMeta } = require('next/dist/server/request-meta');
const { use } = require('react');

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

router.get("/info/:user_id", (req, res) => {
    const user_id = Number(req.params.user_id);
    db.query(`SELECT * FROM user_info WHERE user_id = ${ user_id }`, (err, result) => {
        if (err) throw err;
        return res.status(200).json({"user_info": result});
    })
})

router.post("/info/:user_id", async (req, res) => {
    try {
        const userId = Number(req.params.user_id);
        const { country, zip_code, city, address, balance, trust_lvl, phone_number } = req.body;
        if (!country || !zip_code || !city || !address || !balance || !trust_lvl || !phone_number) {
          return res.status(400).json({ msg: 'Bad parameter' });
        }
        const [rows] = await dbPromise.query('SELECT 1 FROM user_info WHERE user_id = ?', [userId]);
        if (rows.length > 0) return res.status(400).json({ msg: "User's informations already exist, please use PUT /user/info:id instead" });

        const created_at = (new Date());
        const query = 'INSERT INTO user_info (created_at, country, zip_code, city, address, balance, trust_lvl, phone_number, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await dbPromise.query(
            query,
            [created_at, country, zip_code, city, address, balance, trust_lvl, phone_number, userId]
        );
        return res.status(200).json({"created_at" : created_at,
            "country" : country, "zip_code" : zip_code, "city" : city, "address" : address,
            "balance" : balance, "trust_lvl" : trust_lvl, "user_id" : userId})
    } catch (err) {
        return res.status(500).json({ msg: 'Internal error', "reason": err });
    }
})

router.put('/info/:user_id', async (req, res) => {
  try {
    const userId = Number(req.params.user_id);
    const { country, zip_code, city, address, balance, trust_lvl, phone_number } = req.body;
    if (!country || !zip_code || !city || !address || !balance || !trust_lvl || !phone_number) {
      return res.status(400).json({ msg: 'Bad parameter' });
    }

    const [rows] = await dbPromise.query('SELECT 1 FROM user_info WHERE user_id = ?', [userId]);
    if (!rows.length) return res.status(400).json({ msg: "This user doesn't have any information yet." });

    await dbPromise.query(
      'UPDATE user_info SET country=?, zip_code=?, city=?, address=?, balance=?, trust_lvl=?, phone_number=? WHERE user_id=?',
      [country, zip_code, city, address, balance, trust_lvl, phone_number, userId]
    );

    return res.status(200).json({ country, zip_code, city, address, balance, trust_lvl, phone_number, user_id: userId });
  } catch (err) {
    return res.status(500).json({ msg: 'Internal error', "reason": err });
  }
});

router.delete('/info/:user_id', async (req, res) => {
  try {
    const userId = Number(req.params.user_id);

    const [rows] = await dbPromise.query('SELECT 1 FROM user_info WHERE user_id = ?', [userId]);
    if (!rows.length) return res.status(400).json({ msg: "This user doesn't have any information yet." });

    await dbPromise.query(
      'DELETE FROM user_info WHERE user_id = ?', [userId],
    );

    return res.status(200).json({msg: "User's informations deleted"});
  } catch (err) {
    return res.status(500).json({ msg: 'Internal error', "reason": err });
  }
});
