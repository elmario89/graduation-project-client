import ApiService from "./api.service";
import {AddOrUpdateTeacher} from "../../types/add-or-update-teacher";
import {Teacher} from "../../types/teacher";
import { Discipline } from "../../types/discipline";
import { Group } from "../../types/group";
import { Visit } from "../../types/visit";

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

    public async getTeacherDisciplines(id: string): Promise<Discipline[]> {
        return await this.apiService.request<Discipline[]>({
            method: 'GET',
            url: `/teachers/teacher/${id}`,
        });
    }

    public async getTeacherGroups(teacherId: string, disciplineId: string): Promise<Group[]> {
        return await this.apiService.request<Group[]>({
            method: 'GET',
            url: `/teachers/groups/${teacherId}/${disciplineId}`,
        });
    }

    public async setVisit(data: { studentId: string; scheduleId: string; date: Date }): Promise<Visit[]> {
        return await this.apiService.request<Visit[]>({
            method: 'POST',
            url: `/visits/teacher`,
            data,
        });
    }

    public async deleteVisit(id: string): Promise<Visit[]> {
        return await this.apiService.request<Visit[]>({
            method: 'DELETE',
            url: `/visits/teacher/${id}`,
        });
    }
}

export default TeachersApi;