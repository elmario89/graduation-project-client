import {Discipline} from "./discipline";

export type Teacher = {
    id: string;
    name: string;
    surname: string;
    login: string;
    password: string;
    disciplines?: Discipline[];
}