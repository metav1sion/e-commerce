import axios, { AxiosError, type AxiosResponse } from "axios";
import { toast } from "react-toastify";
import router from "../router/Routes";

axios.defaults.baseURL = "http://localhost:5220/api/";

axios.interceptors.response.use(response =>{
    return response;
}, (error : AxiosError) => {
    const {data, status} = error.response! as AxiosResponse;
    switch (status) {
        case 400:
            console.log("data", data.errors);
            if (data.errors) {
                const modelStateErrors: string[] = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key]);
                    }
                }
                toast.error(data.title);
                throw modelStateErrors;
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 404:
            toast.error(data.title);
            router.navigate('/not-found', {state: {error: data, status: status}});
            break;
        case 500:
            toast.error(data.title);
            router.navigate('/server-error', {state: {error: data, status: status}});
            break;
        default:
            break;
    }
    return Promise.reject(error);
});

const queries = {
    get : (url: string) => axios.get(url).then((response : AxiosResponse) => response.data),
    post : (url: string, body: {}) => axios.post(url, body).then((response : AxiosResponse) => response.data),
    put : (url: string, body: {}) => axios.put(url, body).then((response : AxiosResponse) => response.data),
    delete : (url: string) => axios.delete(url).then((response : AxiosResponse) => response.data),
}

const Catalog = {
    list: () => queries.get('products'),
    details: (id: number) => queries.get(`products/${id}`)
}

const requests = {
    Catalog
}

export default requests;