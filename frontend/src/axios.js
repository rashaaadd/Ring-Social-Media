import axios from 'axios'

export const USER_API = axios.create({
    baseURL: "http://localhost:5000/",
})

export const USER_API_GET = USER_API.get;
export const USER_API_POST = USER_API.post;

USER_API.interceptors.request.use(
    config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        return config;
    }
)

