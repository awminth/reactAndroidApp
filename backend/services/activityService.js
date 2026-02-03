const express = require('express');
const router = express.Router();
const db = require('../Database');

// GET /api/activities?studentId=123
router.get('/', async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }

        // Query tblstudentactivity for the given StudentID (using EARStudentID/AID logic usually, 
        // but schema suggests just querying by AID or linking field. 
        // Based on other services, we often filter by EARStudentID or similar.
        // The user request context implies we want activities for the student.
        // Checked schema: AID, LoginID, EARStudentID, Description, Date, File.
        // So we filter by EARStudentID.
        
        const query = `
            SELECT * 
            FROM tblstudentactivity 
            WHERE EARStudentID = ? 
            ORDER BY Date DESC
        `;
        
        const [rows] = await db.query(query, [studentId]);
        
        res.json(rows);

    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
