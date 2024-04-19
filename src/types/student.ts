import {Group} from "./group";

export type Student = {
    id: string;
    name: string;
    surname: string;
    login: string;
    password: string;
    group: Group;
}