import {cacheDuration, newsApiKey, redisConnectionString} from '../config';
import Redis from "ioredis";
import axios from "axios";
const redis = new Redis(redisConnectionString);

export async function getSources() {
    let redisSources = await redis.get("newsapp:sources");
    if (redisSources) {
        let sourcesObj = JSON.parse(redisSources);
        return {...sourcesObj, source:'redis'};
    }

    let response = await axios.get(`https://newsapi.org/v2/top-headlines/sources?apiKey=${newsApiKey}`);
    if (response.status === 200) {
        redis.set("newsapp:sources", JSON.stringify(response.data), "EX", cacheDuration);
        return {...response.data, source:'api'};
    }

}