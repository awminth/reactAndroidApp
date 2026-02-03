const express = require('express');
const router = express.Router();
const db = require('../Database');

// GET /api/profile?studentId=123
router.get('/', async (req, res) => {
    try {
        const { studentId } = req.query;

        if (!studentId) {
            return res.status(400).json({ error: 'Student ID is required' });
        }

        // Query tblstudentprofile for the given StudentID (AID)
        // tblstudentprofile.AID corresponds to tblparent_student.StudentID
        const query = `
            SELECT * 
            FROM tblstudentprofile 
            WHERE AID = ? 
            LIMIT 1
        `;
        
        const [rows] = await db.query(query, [studentId]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Student profile not found' });
        }
        
        res.json(rows[0]);

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
