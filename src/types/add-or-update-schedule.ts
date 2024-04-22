import {ScheduleType} from "../enums/schedule-type.enum";
import {Day} from "./day";

export type AddOrUpdateSchedule = {
    id: string;
    day: Day;
    time: string;
    disciplineId: string;
    scheduleType: ScheduleType;
    locationId?: string;
    teacherId: string;
    groupId: string;
}