import {Day} from "./day";
import {ScheduleType} from "../enums/schedule-type.enum";
import {Teacher} from "./teacher";
import {Discipline} from "./discipline";
import {Location} from "./location";
import { Group } from "./group";

export type Schedule = {
    id: string;
    day: Day;
    timeStart: string;
    timeFinish: string;
    discipline: Discipline;
    scheduleType: ScheduleType;
    location: Location;
    teacher: Teacher;
    group: Group;
}