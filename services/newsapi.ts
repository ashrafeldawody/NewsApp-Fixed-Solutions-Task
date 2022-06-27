import {newsApiKey, newsCacheExpiry, redisConnectionString, sourcesCacheExpiry} from '../config';
import Redis from "ioredis";
import axios from "axios";

const redis = new Redis(redisConnectionString);

export async function getSources() {
    let redisSources = await redis.get("newsapp:sources");
    if (redisSources) {
        return JSON.parse(redisSources);
    }

    let response = await axios.get(`https://newsapi.org/v2/top-headlines/sources?apiKey=${newsApiKey}`);
    if (response.status === 200) {
        redis.set("newsapp:sources", JSON.stringify(response.data), "EX", sourcesCacheExpiry);
        return response.data;
    }
}

export async function getSource(sourceId:string) {
    const sources = await getSources();
    return sources.sources.find((source:any) => source.id === sourceId);
}

export async function getNewsAndArticles(sourcesList:string[]) {
    let uncachedSources:string[] = [];

    // if any of the sources is not cached, it will return null
    let cachedSources:string[] = await redis.mget(...sourcesList.map((key)=>`newsapp:articles:${key}`)) as string[]

    const parsedCachedSources:any[] = [];

    cachedSources.forEach((source,index) => {
        if (!source) {
            uncachedSources.push(sourcesList[index]);
            return;
        }
        parsedCachedSources.push(JSON.parse(source));
    })

    //if all sources are cached, return them
    if (uncachedSources.length === 0) {
        return parsedCachedSources
    }

    let uncachedString = uncachedSources.join(',');
    let response = await axios.get(`https://newsapi.org/v2/top-headlines?sources=${uncachedString}&apiKey=${newsApiKey}`);

    if (response.status === 200) {
        const filteredSources:any = {};

        uncachedSources.forEach((source:any) => {
            let filtered = response.data.articles.filter((article:any) => article.source.id === source);
            if(filtered.length > 0)
                filteredSources[source] = JSON.stringify(filtered);
        });
        let redisDataWithExpiry = Object.keys(filteredSources).map((k) => {
            return ['set', `newsapp:articles:${k}`, filteredSources[k], 'ex', newsCacheExpiry];
        });
        await redis.multi(redisDataWithExpiry).exec();
        return [...Object.keys(filteredSources).map(key => JSON.parse(filteredSources[key])).flat(), ...parsedCachedSources.flat()];

    }
}