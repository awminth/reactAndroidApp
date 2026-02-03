const express = require('express');
const router = express.Router();
const db = require('../Database');

// GET /api/attendance?studentId=123
router.get('/', async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }

        // Query tblstudentattendance for the given EARStudentID
        const query = `
            SELECT * 
            FROM tblstudentattendance 
            WHERE EARStudentID = ? 
            ORDER BY AttendanceDate DESC
        `;
        
        const [rows] = await db.query(query, [studentId]);
        
        res.json(rows);

    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
