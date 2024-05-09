import ApiService from "./api.service";
import { Visit } from "../../types/visit";

class VisitsServiceApi {
    constructor(private apiService: ApiService) { }

    public async getVisitByScheduleAndStudent(studentId: string, scheduleId: string): Promise<Visit[]> {
        return await this.apiService.request<Visit[]>({
            method: 'GET',
            url: `/visits/visit/${studentId}/${scheduleId}`,
        });
    }
}

export default VisitsServiceApi;