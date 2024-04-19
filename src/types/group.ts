import {Faculty} from "./faculty";
import {Student} from "./student";

export type Group = {
    id: string;
    name: string;
    start: Date;
    finish: Date;
    faculty: Faculty;
    students?: Student[];
}