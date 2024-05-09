import ApiService from "./api.service";
import {Schedule} from "../../types/schedule";
import {AddOrUpdateSchedule} from "../../types/add-or-update-schedule";
class SchedulesApi {
    constructor(private apiService: ApiService) { }

    public async getAllSchedules(): Promise<Schedule[]> {
        return await this.apiService.request<Schedule[]>({
            method: 'GET',
            url: '/schedules',
        });
    }

    public async getScheduleById(id: string): Promise<Schedule> {
        return await this.apiService.request<Schedule>({
            method: 'GET',
            url: `/schedules/schedule/${id}`,
        });
    }

    public async getSchedulesByGroupId(groupId: string): Promise<Schedule[] | undefined> {
        return await this.apiService.request<Schedule[] | undefined>({
            method: 'GET',
            url: `/schedules/group/${groupId}`,
        });
    }


    public async createSchedule(data: Omit<AddOrUpdateSchedule, 'id'>): Promise<Schedule> {
        return await this.apiService.request<Schedule>({
            method: 'POST',
            url: '/schedules',
            data,
        });
    }

    public async updateSchedule(data: AddOrUpdateSchedule): Promise<Schedule> {
        return await this.apiService.request<Schedule>({
            method: 'PUT',
            url: `/schedules/${data.id}`,
            data,
        });
    }

    public async deleteSchedule(id: string): Promise<void> {
        return await this.apiService.request<void>({
            method: 'DELETE',
            url: `/schedules/${id}`,
        });
    }

    public async getScheduleByGroupAndDiscipline(groupId: string, disciplineId: string): Promise<Schedule[]> {
        return await this.apiService.request<Schedule[]>({
            method: 'GET',
            url: `/schedules/discipline/${groupId}/${disciplineId}`,
        });
    }
}

export default SchedulesApi;