const express = require('express');
const router = express.Router();
const db = require('../Database');

// POST /api/password/change
router.post('/change', async (req, res) => {
    try {
        const { userId, oldPassword, newPassword } = req.body;

        if (!userId || !oldPassword || !newPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // 1. Verify Old Password
        const [userRows] = await db.query(
            'SELECT * FROM tblparent WHERE AID = ? AND Password = ?',
            [userId, oldPassword]
        );

        if (userRows.length === 0) {
            return res.status(401).json({ error: 'Incorrect old password' });
        }

        // 2. Update to New Password
        await db.query(
            'UPDATE tblparent SET Password = ? WHERE AID = ?',
            [newPassword, userId]
        );

        res.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
