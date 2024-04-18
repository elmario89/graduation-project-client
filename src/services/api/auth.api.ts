import ApiService from "./api.service";
import {Auth} from "../../types/auth";
import {IStorageService} from "../../types/storage-service";
import {StorageService} from "../storage.service";
import {User} from "../../types/user";

class AuthApi {
    private readonly storageService: IStorageService;

    constructor(private apiService: ApiService) {
        this.storageService = new StorageService();
    }

    public async signIn(data: Auth): Promise<{ token: string; user: User }> {
        const response = await this.apiService.request<{ token: string; user: User }>({
            method: 'POST',
            url: '/auth/login',
            data,
        });

        this.storageService.setItem('userInfo', response);

        return response;
    }
}

export default AuthApi;