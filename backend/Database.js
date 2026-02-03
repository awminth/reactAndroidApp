const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || '72.61.126.206',
  user: process.env.DB_USER || 'root_nc',
  password: process.env.DB_PASSWORD || 'ncpassword',
  // The DB name is "sms_react" (with underscore) per original request.
  database: process.env.DB_NAME || 'sms-react',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

const pool = mysql.createPool(dbConfig);

// Wrapper to handle ECONNRESET and other transient errors
const promisePool = pool.promise();

const originalQuery = promisePool.query.bind(promisePool);

promisePool.query = async function (...args) {
  const MAX_RETRIES = 3;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      return await originalQuery(...args);
    } catch (err) {
      if ((err.code === 'ECONNRESET' || err.code === 'PROTOCOL_CONNECTION_LOST') && i < MAX_RETRIES - 1) {
        console.warn(`Database connection lost. Retrying query (Attempt ${i + 1}/${MAX_RETRIES})...`);
        // Small delay before retry
        await new Promise(res => setTimeout(res, 200));
        continue;
      }
      throw err;
    }
  }
};

module.exports = promisePool;
