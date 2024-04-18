import ApiService from "./api.service";
import {Group} from "../../types/group";

class GroupsApi {
    constructor(private apiService: ApiService) { }

    public async getAllGroups(): Promise<Group[]> {
        return await this.apiService.request<Group[]>({
            method: 'GET',
            url: '/groups',
        });
    }
}

export default GroupsApi;