const dotenv = require('dotenv');
dotenv.config();
export const port = process.env.PORT || 3000;
export const newsApiKey:string = process.env.NEWS_API_KEY||'';
export const mongoConnectionString:string = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/news';
export const jwtSecret:string = process.env.JWT_SECRET || 'secret';
export const cacheDuration = process.env.CACHE_DURATION || 1800;
export const redisConnectionString = process.env.REDIS_CONNECTION_STRING || 'redis://localhost:6379';
