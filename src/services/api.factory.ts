import ApiService from "./api/api.service";
import AuthApi from "./api/auth.api";
import GroupsApi from "./api/groups.api";
import FacultiesApi from "./api/faculties.api";
import UsersApi from "./api/students.api";
import TeachersApi from "./api/teachers.api";
import DisciplinesApi from "./api/disciplines.api";

export class ApiFactory {
    public static createApi() {
        const apiService = new ApiService();

        return {
            authApi: new AuthApi(apiService),
            groupsApi: new GroupsApi(apiService),
            facultiesApi: new FacultiesApi(apiService),
            studentsApi: new UsersApi(apiService),
            teachersApi: new TeachersApi(apiService),
            disciplinesApi: new DisciplinesApi(apiService),
        };
    }
}