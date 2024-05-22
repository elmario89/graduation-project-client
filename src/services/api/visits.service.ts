import ApiService from "./api.service";
import { Visit } from "../../types/visit";

class VisitsServiceApi {
    constructor(private apiService: ApiService) { }

    public async getVisitByScheduleAndStudent(studentId: string, scheduleIds: string[]): Promise<Visit[]> {
        return await this.apiService.request<Visit[]>({
            method: 'GET',
            url: `/visits/student/${studentId}/`,
            params: { scheduleIds },
            paramsSerializer: {
                indexes: null,
            }
        });
    }

    public async getVisitBySchedule(scheduleIds: string[]): Promise<Visit[]> {
        return await this.apiService.request<Visit[]>({
            method: 'GET',
            url: `/visits/schedule`,
            params: { scheduleIds },
            paramsSerializer: {
                indexes: null,
            }
        });
    }
}

export default VisitsServiceApi;