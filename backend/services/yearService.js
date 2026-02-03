const express = require('express');
const cors = require('cors');
const db = require('../Database');

const app = express.Router();

app.use(cors());
app.use(express.json());

// Get Active Academic Years
// Endpoint: /api/years/active
app.get('/active', async (req, res) => {
    try {
        const query = 'SELECT * FROM tblearyear WHERE IsActive = 1 ORDER BY AID DESC';
        const [rows] = await db.query(query);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching active years:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch active academic years' 
        });
    }
});

module.exports = app;
