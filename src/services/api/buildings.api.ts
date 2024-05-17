import ApiService from "./api.service";
import { Building } from "../../types/building";
import { Day } from "../../types/day";
import { TimeMapper } from "../../containers/mappers/time.mapper";

class BuildingsApi {
  constructor(private apiService: ApiService) {}

  public async getAllBuildings(): Promise<Building[]> {
    return await this.apiService.request<Building[]>({
      method: "GET",
      url: "/buildings",
    });
  }

  public async getBuildingById(id: string): Promise<Building> {
    return await this.apiService.request<Building>({
      method: "GET",
      url: `/buildings/${id}`,
    });
  }

  public async createBuilding(data: Omit<Building, "id">): Promise<Building> {
    return await this.apiService.request<Building>({
      method: "POST",
      url: "/buildings",
      data,
    });
  }

  public async updateBuilding(data: Building): Promise<Building> {
    return await this.apiService.request<Building>({
      method: "PUT",
      url: `/buildings/${data.id}`,
      data,
    });
  }

  public async deleteBuilding(id: string): Promise<void> {
    return await this.apiService.request<void>({
      method: "DELETE",
      url: `/buildings/${id}`,
    });
  }
}

export default BuildingsApi;
