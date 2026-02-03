const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

let isRedisAvailable = false;

client.on('error', (err) => {
    // Only log the error if it's NOT a connection refusal during initial setup or runtime (to avoid spamming logs if optional)
    // Or just log it simply.
    // console.error('Redis Client Error', err);
    isRedisAvailable = false;
});

client.on('connect', () => {
    console.log('Redis Client Connected');
    isRedisAvailable = true;
});

client.on('ready', () => {
    isRedisAvailable = true;
});

client.on('end', () => {
    isRedisAvailable = false;
});

// Attempt to connect, but don't crash if it fails
(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.log('Redis connection failed (running in fallback mode):', err.message);
        isRedisAvailable = false;
    }
})();

/**
 * Helper to get data from cache or fetch from DB (fallback)
 * @param {string} key - Cache key
 * @param {Function} fetchDataFn - Async function to fetch data if cache miss
 * @param {number} expiration - Start expiration time in seconds (default 3600)
 */
const getOrSetCache = async (key, fetchDataFn, expiration = 3600) => {
    // 1. If Redis is not available, just fetch directly
    if (!isRedisAvailable || !client.isOpen) {
        console.log(`[Cache Skipped] Redis unavailable for key: ${key}`);
        return await fetchDataFn();
    }

    try {
        // 2. Try to get from Redis
        const cachedData = await client.get(key);
        if (cachedData) {
            console.log(`[Cache Hit] Key: ${key}`);
            return JSON.parse(cachedData);
        }

        // 3. Cache Miss - Fetch data
        console.log(`[Cache Miss] Key: ${key}`);
        const data = await fetchDataFn();

        // 4. Save to Redis
        if (data) {
            await client.setEx(key, expiration, JSON.stringify(data));
        }
        
        return data;

    } catch (error) {
        console.error('Redis operation failed, falling back to db:', error);
        // Fallback to DB if Redis operation errors out
        return await fetchDataFn();
    }
};

module.exports = {
    client,
    getOrSetCache
};
