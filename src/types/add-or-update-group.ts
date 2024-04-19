import {Group} from "./group";

export type AddOrUpdateGroup = Omit<Group, 'faculty'> & {
    facultyId: string;
}