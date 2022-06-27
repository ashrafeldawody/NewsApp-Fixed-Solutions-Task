const dotenv = require('dotenv');
dotenv.config();
 const port = process.env.PORT || 3000;
 const newsApiKey = process.env.NEWS_API_KEY||'';
 const mongoConnectionString = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/news';
 const jwtSecret = process.env.JWT_SECRET || 'secret';
 const sourcesCacheExpiry = process.env.SOURCES_CACHE_EXPIRY || 3600; // 1 hour
 const newsCacheExpiry = process.env.NEWS_CACHE_EXPIRY || 600; // 10 minutes
 const redisConnectionString = process.env.REDIS_CONNECTION_STRING || 'redis://localhost:6379';

export {
    port,
    newsApiKey,
    mongoConnectionString,
    jwtSecret,
    sourcesCacheExpiry,
    newsCacheExpiry,
    redisConnectionString
}