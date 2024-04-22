import {Day} from "./day";
import {ScheduleType} from "../enums/schedule-type.enum";
import {Teacher} from "./teacher";
import {Discipline} from "./discipline";

export type Schedule = {
    id: string;
    day: Day;
    time: string;
    discipline: Discipline;
    scheduleType: ScheduleType;
    locationId?: string;
    teacher: Teacher;
}