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

    public async getGroupById(id: string): Promise<Group> {
        return await this.apiService.request<Group>({
            method: 'GET',
            url: `/groups/${id}`,
        });
    }

    public async createGroup(data: Omit<Group, 'id'>): Promise<Group> {
        return await this.apiService.request<Group>({
            method: 'POST',
            url: '/groups',
            data,
        });
    }

    public async updateGroup(data: Group): Promise<Group> {
        return await this.apiService.request<Group>({
            method: 'PUT',
            url: `/groups/${data.id}`,
            data,
        });
    }
}

export default GroupsApi;