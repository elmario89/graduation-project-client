import ApiService from "./api.service";
import {AddOrUpdateTeacher} from "../../types/add-or-update-teacher";
import {Teacher} from "../../types/teacher";

class TeachersApi {
    constructor(private apiService: ApiService) { }

    public async getAll(): Promise<Teacher[]> {
        return await this.apiService.request<Teacher[]>({
            method: 'GET',
            url: '/teachers',
        });
    }

    public async getById(id: string): Promise<Teacher> {
        return await this.apiService.request<Teacher>({
            method: 'GET',
            url: `/teachers/${id}`,
        });
    }

    public async create(data: Omit<AddOrUpdateTeacher, 'id'>): Promise<Teacher> {
        return await this.apiService.request<Teacher>({
            method: 'POST',
            url: '/teachers',
            data,
        });
    }

    public async update(data: AddOrUpdateTeacher): Promise<Teacher> {
        return await this.apiService.request<Teacher>({
            method: 'PUT',
            url: `/teachers/${data.id}`,
            data,
        });
    }

    public async delete(id: string): Promise<void> {
        return await this.apiService.request<void>({
            method: 'DELETE',
            url: `/teachers/${id}`,
        });
    }
}

export default TeachersApi;