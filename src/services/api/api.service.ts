import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {IStorageService} from "../../types/storage-service";
import {StorageService} from "../storage.service";

class ApiService {
    private readonly axios: AxiosInstance;
    private readonly storageService: IStorageService;

    constructor() {
        this.storageService = new StorageService();

        this.axios = axios.create({
            baseURL: process.env.REACT_APP_API_ADDRESS,
        });

        // intercept request and add token
        // @ts-ignore
        this.axios.interceptors.request.use((config: AxiosRequestConfig) => {
            const token = this.storageService.getItem<string>('token');

            if (token) {
                config.headers!.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        // intercept 403
        this.axios.interceptors.response.use(
            // @ts-ignore
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response?.status === 403) {
                    const token = this.storageService.getItem('token');

                    if (token) {
                        this.storageService.clearItem('token');
                        window.location.assign('/sign-in');
                    }
                }

                return Promise.reject(error);
        });
    }

    public async request<T>(requestConfig: AxiosRequestConfig): Promise<T> {
        const response: AxiosResponse = await this.axios.request<T>(requestConfig);

        return response?.data;
    }
}

export default ApiService;