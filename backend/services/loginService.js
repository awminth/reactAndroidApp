const express = require('express');
const cors = require('cors');
// Updated imports to point to parent directory
const db = require('../Database');
const { getOrSetCache } = require('../redisClient');

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors({
    origin: '*', // Allow all origins for now to fix the issue
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

// Manual CORS headers for Vercel Serverless edge cases
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
app.use(express.json());

// Mount Year Service
const yearService = require('./yearService');
app.use('/api/years', yearService);

const feeService = require('./feeService');
app.use('/api/fees', feeService);

const examService = require('./examService');
app.use('/api/exams', examService);

const activityService = require('./activityService');
app.use('/api/activities', activityService);

console.log('Registering attendance service...');
const attendanceService = require('./attendanceService');
app.use('/api/attendance', attendanceService);

console.log('Registering profile service...');
const profileService = require('./profileService');
app.use('/api/profile', profileService);

console.log('Registering announcement service...');
const announcementService = require('./announcementService');
app.use('/api/announcements', announcementService);

console.log('Registering password service...');
const passwordService = require('./passwordService');
app.use('/api/password', passwordService);

// Request Logger
// Sample endpoint with Pagination + Redis Caching
// Usage: GET /api/items?page=1&limit=10
app.get('/api/items', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Unique cache key based on query params
        const cacheKey = `items?page=${page}&limit=${limit}`;

        const data = await getOrSetCache(cacheKey, async () => {
            // This function runs only if cache miss or redis down
            
            // 1. Get total count for pagination metadata
            const [rows] = await db.query('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset]);
            const [[{ count }]] = await db.query('SELECT COUNT(*) as count FROM users');

            return {
                data: rows,
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit)
                }
            };
        });

        res.json(data);

    } catch (error) {
        console.error('Error fetching items:', error);
        
        // Handle specific table doesn't exist error nicely for the demo
        if (error.code === 'ER_NO_SUCH_TABLE') {
             return res.status(500).json({ 
                 error: "Table 'users' does not exist. Please create the table or adjust the query in server.js.",
                 details: error.message
             });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Logic to handle "username" or "username@gmail.com"
        // We want to match against `UserName` column in `tblparent`.
        
        let candidateUsernames = [username];
        
        // If input doesn't have @gmail.com, try adding it
        if (!username.toLowerCase().endsWith('@gmail.com')) {
            candidateUsernames.push(username + '@gmail.com');
        } else {
             // If input HAS @gmail.com, try removing it (in case DB stores just "bob")
             candidateUsernames.push(username.replace('@gmail.com', ''));
        }

        // Construct query to check for any of these candidates
        const placeholders = candidateUsernames.map(() => '?').join(',');
        const query = `
            SELECT * 
            FROM \`sms-react\`.\`tblparent\` 
            WHERE \`UserName\` IN (${placeholders}) 
            AND \`Password\` = ?
            LIMIT 1
        `;

        // Params: [...usernames, password]
        const params = [...candidateUsernames, password];

        const [rows] = await db.query(query, params);

        if (rows.length > 0) {
            const user = rows[0];

            // Check Status
            // status can be number 0 or string '0'
            if (user.Status == 0 || user.Status === '0') {
                return res.status(401).json({ error: 'Account is inactive. Please contact support.' });
            }

            // 1. Fetch StudentID from tblparent_student
            const [studentRows] = await db.query(
                'SELECT StudentID FROM tblparent_student WHERE ParentID = ? LIMIT 1', 
                [user.AID]
            );
            
            let studentId = null;
            let earStudentId = null;
            let studentName = null;

            if (studentRows.length > 0) {
                studentId = studentRows[0].StudentID;

                // 2. Fetch EARStudentID (AID) from tblearstudent
                const [earRows] = await db.query(
                    'SELECT AID FROM tblearstudent WHERE StudentID = ? ORDER BY AID DESC LIMIT 1',
                    [studentId]
                );

                if (earRows.length > 0) {
                    earStudentId = earRows[0].AID;
                }

                // 3. Fetch Student Name from tblstudentprofile
                const [profileRows] = await db.query(
                    'SELECT Name FROM tblstudentprofile WHERE AID = ? LIMIT 1',
                    [studentId]
                );
                
                if (profileRows.length > 0) {
                    studentName = profileRows[0].Name;
                }
            }

            // Validation: Check if student data exists
            if (!studentId) {
                return res.status(403).json({ error: 'No associated student found. Please contact the school administration.' });
            }

            if (!earStudentId) {
                 return res.status(403).json({ error: 'No active academic record found for this student.' });
            }

            // Login Success
            res.json({ 
                success: true, 
                user: {
                    id: user.AID,
                    name: user.Name, // Parent Name
                    username: user.UserName,
                    loginId: user.LoginID,
                    status: user.Status,
                    studentId: studentId,
                    earStudentId: earStudentId,
                    studentName: studentName // Student Name
                }
            });
        } else {
            // Login Failed
            res.status(401).json({ error: 'Username or password incorrect' });
        }

    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({ 
            error: 'Internal server error during login', 
            details: error.message,
            code: error.code
        });
    }
});

// Update FCM Token Endpoint
app.post('/api/update-fcm', async (req, res) => {
    const { userId, token } = req.body;

    if (!userId || !token) {
        return res.status(400).json({ error: 'User ID and Token are required' });
    }

    try {
        // Optimization: Check if token is already the same to avoid unnecessary writes
        const [rows] = await db.query('SELECT FCM FROM tblparent WHERE AID = ?', [userId]);
        if (rows.length > 0 && rows[0].FCM === token) {
            console.log(`FCM Token matches for User ${userId}, skipping update.`);
            return res.json({ success: true, message: 'Token already up to date' });
        }

        const query = 'UPDATE tblparent SET FCM = ? WHERE AID = ?';
        await db.query(query, [token, userId]);
        console.log(`FCM Token updated for User ${userId}`);
        res.json({ success: true, message: 'FCM Token updated successfully' });
    } catch (error) {
        console.error('Error updating FCM token:', error);
        res.status(500).json({ error: 'Failed to update FCM token' });
    }
});

// Notification Routes (Restored for Frontend Compatibility)
app.post('/api/subscribe', (req, res) => {
    const { token } = req.body;
    console.log('New FCM Token stored:', token);
    res.status(201).json({ message: 'Token received' });
});
  
app.post('/api/send-notification', (req, res) => {
    const { token } = req.body;
    console.log(`[SIMULATION] Target Token: ${token}`);
    res.json({ message: 'Log logged. Use Firebase Console to test actual delivery.' });
});

// Basic health check
app.get('/', (req, res) => {
    res.send('Backend is running');
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
