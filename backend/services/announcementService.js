const express = require('express');
const router = express.Router();
const db = require('../Database');

// GET /api/announcements
router.get('/', async (req, res) => {
    try {
        // Query tblaccoumentall ordered by Date descending
        const query = `
            SELECT * 
            FROM tblaccoumentall 
            ORDER BY Date DESC
        `;
        
        const [rows] = await db.query(query);
        res.json(rows);

    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
