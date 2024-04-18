import ApiService from "./api.service";
import {Auth} from "../../types/auth";
import {IStorageService} from "../../types/storage-service";
import {StorageService} from "../storage.service";

class AuthApi {
    private readonly storageService: IStorageService;

    constructor(private apiService: ApiService) {
        this.storageService = new StorageService();
    }

    public async signIn(data: Auth): Promise<string> {
        const response = await this.apiService.request<{ token: string }>({
            method: 'POST',
            url: '/auth/login',
            data,
        });

        this.storageService.setItem('token', response.token);

        return response.token;
    }
}

export default AuthApi;