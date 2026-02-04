import axios from "axios";

const JavaAxiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    headers:{
        "Content-Type":"application/json"
    }
});

JavaAxiosInstance.interceptors.request.use(config=>{
    if(!config.url.includes("auth")){
        config.headers={
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        };
    }
    return config;
})

export default JavaAxiosInstance;