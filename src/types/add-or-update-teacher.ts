import {Teacher} from "./teacher";

export type AddOrUpdateTeacher = Omit<Teacher, 'disciplines'> & {
    disciplineIds: string[];
}