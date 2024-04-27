import ApiService from "./api.service";
import {Location} from "../../types/location";

class LocationsApi {
    constructor(private apiService: ApiService) { }

    public async getAllLocations(): Promise<Location[]> {
        return await this.apiService.request<Location[]>({
            method: 'GET',
            url: '/locations',
        });
    }

    public async getLocationById(id: string): Promise<Location> {
        return await this.apiService.request<Location>({
            method: 'GET',
            url: `/locations/${id}`,
        });
    }

    public async createLocation(data: Omit<Location, 'id'>): Promise<Location> {
        return await this.apiService.request<Location>({
            method: 'POST',
            url: '/locations',
            data,
        });
    }

    public async updateLocation(data: Location): Promise<Location> {
        return await this.apiService.request<Location>({
            method: 'PUT',
            url: `/locations/${data.id}`,
            data,
        });
    }

    public async deleteLocation(id: string): Promise<void> {
        return await this.apiService.request<void>({
            method: 'DELETE',
            url: `/locations/${id}`,
        });
    }
}

export default LocationsApi;