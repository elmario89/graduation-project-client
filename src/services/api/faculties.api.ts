import ApiService from "./api.service";
import {Faculty} from "../../types/faculty";

class FacultiesApi {
    constructor(private apiService: ApiService) { }

    public async getAllFaculties(): Promise<Faculty[]> {
        return await this.apiService.request<Faculty[]>({
            method: 'GET',
            url: '/faculties',
        });
    }

    public async getFacultyById(id: string): Promise<Faculty> {
        return await this.apiService.request<Faculty>({
            method: 'GET',
            url: `/faculties/${id}`,
        });
    }

    public async createFaculty(data: Omit<Faculty, 'id'>): Promise<Faculty> {
        return await this.apiService.request<Faculty>({
            method: 'POST',
            url: '/faculties',
            data,
        });
    }

    public async updateFaculty(data: Faculty): Promise<Faculty> {
        return await this.apiService.request<Faculty>({
            method: 'PUT',
            url: `/faculties/${data.id}`,
            data,
        });
    }

    public async deleteFaculty(id: string): Promise<void> {
        return await this.apiService.request<void>({
            method: 'DELETE',
            url: `/faculties/${id}`,
        });
    }
}

export default FacultiesApi;