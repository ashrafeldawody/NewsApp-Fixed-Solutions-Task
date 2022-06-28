import {jwtExpiration, redisConnectionString} from '../config';
import Redis from "ioredis";

const redis = new Redis(redisConnectionString);

export async function checkBlacklisted(token:string) {
    let blacklisted = await redis.get(`newsapp:blacklist:${token}`);
    return !!blacklisted;
}

export async function addToBlacklist(token:string) {
    await redis.set(`newsapp:blacklist:${token}`, 'true', 'EX', jwtExpiration);
}