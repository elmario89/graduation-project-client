import {UserRole} from "../enums/user-role";

export type User = {
    id: string;
    name: string;
    surname: string;
    role: UserRole;
    groupId?: string;
}