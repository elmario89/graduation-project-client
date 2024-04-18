import ApiService from "./api/api.service";
import AuthApi from "./api/auth.api";
import GroupsApi from "./api/groups.api";

export class ApiFactory {
    public static createApi() {
        const apiService = new ApiService();

        return {
            authApi: new AuthApi(apiService),
            groupsApi: new GroupsApi(apiService),
        };
    }
}