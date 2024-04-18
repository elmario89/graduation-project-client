import {UserRole} from "../enums/user-role";

export type User = {
    name: string;
    surname: string;
    role: UserRole;
}