import {newsApiKey, newsCacheExpiry, redisConnectionString, sourcesCacheExpiry} from '../config';
import Redis from "ioredis";
import newsAPI from "../config/newsapi";

const redis = new Redis(redisConnectionString);

export async function getSources() {
    let redisSources = await redis.get("newsapp:sources");
    if (redisSources) {
        return JSON.parse(redisSources);
    }

    return await newsAPI.get(`top-headlines/sources?apiKey=${newsApiKey}`).then(response => {
        redis.set("newsapp:sources", JSON.stringify(response.data), "EX", sourcesCacheExpiry);
        return response.data;
    })

}

export async function getSource(sourceId:string) {
    const sources = await getSources();
    return sources.sources.find((source:any) => source.id === sourceId);
}

export async function getNewsAndArticles(sourcesList:string[],page:string="1") {
    let uncachedSources:string[] = [];

    // if any of the sources is not cached, it will return null
    let cachedSources:string[] = await redis.mget(...sourcesList.map((key)=>`newsapp:articles:${key}:${page}`)) as string[]

    const parsedCachedNews:any[] = [];

    cachedSources.forEach((source,index) => {
        if (!source) {
            uncachedSources.push(sourcesList[index]);
            return;
        }
        parsedCachedNews.push(JSON.parse(source));
    })

    //if all sources are cached, return them
    if (uncachedSources.length === 0) {
        return parsedCachedNews.flat()
    }

    const parsedUncachedNews:any[] = [];
    await newsAPI.get(`everything?sources=${uncachedSources.join(',')}&page=${page}&apiKey=${newsApiKey}`)
        .then((response)=>{
            const filteredSources:any = {};
            uncachedSources.forEach((source:any) => {
                let filtered = response.data.articles.filter((article:any) => article.source.id === source);
                filteredSources[source] = JSON.stringify(filtered);
                parsedUncachedNews.push(...filtered);
            });
            let redisDataWithExpiry = Object.keys(filteredSources).map((k) => {
                return ['set', `newsapp:articles:${k}:${page}`, filteredSources[k], 'ex', newsCacheExpiry];
            });
            redis.multi(redisDataWithExpiry).exec();

        }).catch(()=>{
            console.log("Error getting news from newsapi");
        })

        //return cached sources + uncached sources
        return parsedUncachedNews.concat(parsedCachedNews);

}