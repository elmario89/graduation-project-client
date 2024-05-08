import { UserRole } from "../enums/user-role";

export type Auth = {
    login: string;
    password: string;
    role: UserRole;
}