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
        const token = await this.apiService.request<string>({
            method: 'POST',
            url: '/auth/login',
            data,
        });

        this.storageService.setItem('token', token);

        return token;
    }
}

export default AuthApi;