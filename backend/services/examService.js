const express = require('express');
const db = require('../Database');
const router = express.Router();

router.get('/:studentId', async (req, res) => {
    const { studentId } = req.params;

    if (!studentId) {
        return res.status(400).json({ success: false, error: 'Student ID is required' });
    }

    try {
        console.log(`[ExamService] Fetching exams for StudentID: ${studentId}`);

        // 1. Fetch Exam Vouchers (Headers)
        const [vouchers] = await db.query(
            'SELECT * FROM tblexam_voucher WHERE EARStudentID = ? ORDER BY Date DESC',
            [studentId]
        );

        // 2. Fetch Details for each voucher
        const examsWithDetails = await Promise.all(vouchers.map(async (voucher) => {
            const [details] = await db.query(
                `SELECT e.*, s.Name as SubjectName 
                 FROM tblexam e 
                 LEFT JOIN tblsubject s ON e.SubjectID = s.AID 
                 WHERE e.ExamVoucherID = ?`,
                [voucher.AID]
            );
            return {
                ...voucher,
                details: details
            };
        }));

        res.json({
            success: true,
            data: examsWithDetails
        });

    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch exam records' });
    }
});

module.exports = router;
