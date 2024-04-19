import ApiService from "./api.service";
import {Discipline} from "../../types/discipline";
import {AddOrUpdateDiscipline} from "../../types/add-or-update-discipline";

class DisciplinesApi {
    constructor(private apiService: ApiService) { }

    public async getAllDisciplines(): Promise<Discipline[]> {
        return await this.apiService.request<Discipline[]>({
            method: 'GET',
            url: '/disciplines',
        });
    }

    public async getDisciplineById(id: string): Promise<Discipline> {
        return await this.apiService.request<Discipline>({
            method: 'GET',
            url: `/disciplines/${id}`,
        });
    }

    public async createDiscipline(data: Omit<AddOrUpdateDiscipline, 'id'>): Promise<Discipline> {
        return await this.apiService.request<Discipline>({
            method: 'POST',
            url: '/disciplines',
            data,
        });
    }

    public async updateDiscipline(data: AddOrUpdateDiscipline): Promise<Discipline> {
        return await this.apiService.request<Discipline>({
            method: 'PUT',
            url: `/disciplines/${data.id}`,
            data,
        });
    }

    public async deleteDiscipline(id: string): Promise<void> {
        return await this.apiService.request<void>({
            method: 'DELETE',
            url: `/disciplines/${id}`,
        });
    }
}

export default DisciplinesApi;