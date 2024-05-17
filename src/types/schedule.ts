import {Day} from "./day";
import {ScheduleType} from "../enums/schedule-type.enum";
import {Teacher} from "./teacher";
import {Discipline} from "./discipline";
import {Auditory} from "./auditory";
import { Group } from "./group";

export type Schedule = {
    id: string;
    day: Day;
    timeStart: string;
    timeFinish: string;
    discipline: Discipline;
    scheduleType: ScheduleType;
    auditory: Auditory;
    teacher: Teacher;
    group: Group;
}