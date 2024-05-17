import ApiService from "./api.service";
import {Auditory} from "../../types/auditory";
import { Day } from "../../types/day";
import { TimeMapper } from "../../containers/mappers/time.mapper";

class AuditoriesApi {
    constructor(private apiService: ApiService) { }

    public async getAllAuditories(): Promise<Auditory[]> {
        return await this.apiService.request<Auditory[]>({
            method: 'GET',
            url: '/auditories',
        });
    }

    public async getAuditoryByDay(day: Day, time: string): Promise<Auditory[]> {
        const unionTime = TimeMapper[time as keyof typeof TimeMapper].split(' - ');
        return await this.apiService.request<Auditory[]>({
            method: 'GET',
            url: `/auditories/${day}/${unionTime[0]}`,
        });
    }

    public async getAuditoryById(id: string): Promise<Auditory> {
        return await this.apiService.request<Auditory>({
            method: 'GET',
            url: `/auditories/${id}`,
        });
    }

    public async createAuditory(data: Omit<Auditory, 'id'>): Promise<Auditory> {
        return await this.apiService.request<Auditory>({
            method: 'POST',
            url: '/auditories',
            data,
        });
    }

    public async updateAuditory(data: Auditory): Promise<Auditory> {
        return await this.apiService.request<Auditory>({
            method: 'PUT',
            url: `/auditories/${data.id}`,
            data,
        });
    }

    public async deleteAuditory(id: string): Promise<void> {
        return await this.apiService.request<void>({
            method: 'DELETE',
            url: `/auditories/${id}`,
        });
    }
}

export default AuditoriesApi;