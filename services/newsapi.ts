import { newsApiKey } from '../config';
import fetch from 'cross-fetch';

export function getSources() {
    return fetch(`https://newsapi.org/v2/top-headlines/sources?apiKey=${newsApiKey}`)
        .then(res => res.json())
}