import ApiService from "./api/api.service";
import AuthApi from "./api/auth.api";

export class ApiFactory {
    public static createApi() {
        const apiService = new ApiService();

        return {
            auth: new AuthApi(apiService),
        };
    }
}