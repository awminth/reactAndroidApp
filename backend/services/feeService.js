const express = require('express');
const db = require('../Database');
const router = express.Router();

router.get('/:earStudentId', async (req, res) => {
    const { earStudentId } = req.params;
    const { yearId } = req.query;

    if (!earStudentId) {
        return res.status(400).json({ success: false, error: 'Student ID is required' });
    }


    try {
        console.log(`[FeeService] Fetching fees for EARStudentID: ${earStudentId}, YearID: ${yearId || 'All'}`);

        let mainQuery = 'SELECT * FROM tblfee WHERE EARStudentID = ?';
        let monthlyQuery = 'SELECT * FROM tblstudentfee WHERE EARStudentID = ?';
        let detailsQuery = 'SELECT * FROM tblfeedetail WHERE EARStudentID = ?';
        let extraQuery = 'SELECT * FROM tblextrafee WHERE EARStudentID = ?';
        
        const params = [earStudentId];
        const queryParams = yearId ? [...params, yearId] : params;

        if (yearId) {
             monthlyQuery += ' AND EARYearID = ?';
             mainQuery += ' AND EARYearID = ?';
             extraQuery += ' AND EARYearID = ?'; 
        }
        
        console.log(`[FeeService] Query Params:`, queryParams);

        // 1. Fetch Main Fees (tblfee) - Annual/Term Fees
        const [mainFees] = await db.query(
            mainQuery + ' ORDER BY Date DESC',
            queryParams
        );

        // 2. Fetch Monthly Fees (tblstudentfee)
        const [monthlyFees] = await db.query(
            monthlyQuery + ' ORDER BY PayDate DESC',
            queryParams
        );
        
        // 3. Fetch Fee Details (tblfeedetail)
        const [feeDetails] = await db.query(
            detailsQuery + ' ORDER BY Date DESC',
            params
        );

        // 4. Fetch Extra Fees (tblextrafee)
        const [extraFees] = await db.query(
            extraQuery + ' ORDER BY Date DESC',
            queryParams
        );

        res.json({
            success: true,
            data: {
                main: mainFees,
                monthly: monthlyFees,
                details: feeDetails,
                extra: extraFees
            }
        });

    } catch (error) {
        console.error('Error fetching fees:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch fee records' });
    }
});

module.exports = router;
