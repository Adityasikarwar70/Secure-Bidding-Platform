import axios from "axios";

const DotNetAxiosInstance = axios.create({
    baseURL:import.meta.env.VITE_DOTNET_URL,
    headers:{
        "Content-Type":"application/json"
    }
});

DotNetAxiosInstance.interceptors.request.use(config=>{
    if(!config.url.includes("auth")){
        config.headers={
            "Authorization":`Bearer ${localStorage.getItem('token')}`
        };
    }
    return config;
})

export default DotNetAxiosInstance;