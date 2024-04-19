import {Student} from "./student";

export type AddOrUpdateStudent = Omit<Student, 'group'> & {
    groupId: string;
}