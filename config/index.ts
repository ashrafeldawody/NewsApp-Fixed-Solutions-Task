const dotenv = require('dotenv');
dotenv.config();
export const port = process.env.PORT || 3000;
export const newsApiKey:string = process.env.NEWS_API_KEY||'';
export const mongoConnectionString:string = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/news';
export const jwtSecret:string = process.env.JWT_SECRET || 'secret';
export const sourcesCacheExpiry = process.env.SOURCES_CACHE_EXPIRY || 3600; // 1 hour
export const newsCacheExpiry = process.env.NEWS_CACHE_EXPIRY || 600; // 10 minutes
export const redisConnectionString = process.env.REDIS_CONNECTION_STRING || 'redis://localhost:6379';
