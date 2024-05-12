import ApiService from "./api.service";
import {Student} from "../../types/student";
import {AddOrUpdateStudent} from "../../types/add-or-update-student";

class StudentsApi {
    constructor(private apiService: ApiService) { }

    public async getAllStudents(): Promise<Student[]> {
        return await this.apiService.request<Student[]>({
            method: 'GET',
            url: '/students',
        });
    }

    public async getStudentById(id: string): Promise<Student> {
        return await this.apiService.request<Student>({
            method: 'GET',
            url: `/students/${id}`,
        });
    }

    public async getStudentsByGroup(groupId: string): Promise<Student[]> {
        return await this.apiService.request<Student[]>({
            method: 'GET',
            url: `/students/by-group/${groupId}`,
        });
    }

    public async createStudent(data: Omit<AddOrUpdateStudent, 'id'>): Promise<Student> {
        return await this.apiService.request<Student>({
            method: 'POST',
            url: '/students',
            data,
        });
    }

    public async updateStudent(data: AddOrUpdateStudent): Promise<Student> {
        return await this.apiService.request<Student>({
            method: 'PUT',
            url: `/students/${data.id}`,
            data,
        });
    }

    public async deleteStudent(id: string): Promise<void> {
        return await this.apiService.request<void>({
            method: 'DELETE',
            url: `/students/${id}`,
        });
    }
}

export default StudentsApi;