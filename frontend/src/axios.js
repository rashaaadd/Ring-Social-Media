import axios from 'axios'

export const USER_API = axios.create({
    baseURL: "http://localhost:5000/",
})

export const USER_API_GET = USER_API.get;
export const USER_API_POST = USER_API.post;
export const USER_API_PUT = USER_API.put;

USER_API.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        return config;
    }
)
export const USER = axios.create({
    baseURL: "http://localhost:5000/",
})

export const USER_GET = USER.get;
export const USER_POST = USER.post;
export const USER_PUT = USER.put;

USER.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        config.headers['Content-Type'] = 'multipart/form-data';
        return config;
    }
)

export const POSTS_API = axios.create({
    baseURL: "http://localhost:5000/post",
})



POSTS_API.interceptors.request.use(
    config => {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem('token')}`;
        return config;
    }
)

export const POSTS = axios.create({
    baseURL: "http://localhost:5000/post",
})

POSTS.interceptors.request.use(
    config => {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem('token')}`;
        config.headers['Content-Type'] = 'multipart/form-data';
        return config;
    }
)

export const POSTS_GET = POSTS.get;
export const POSTS_POST = POSTS.post;
