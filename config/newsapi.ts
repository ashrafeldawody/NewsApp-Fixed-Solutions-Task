import axios from "axios";

let newsAPI = axios.create({
    baseURL: 'https://newsapi.org/v2/',
    timeout: 1000,
});

export default newsAPI;