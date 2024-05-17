import {ScheduleType} from "../enums/schedule-type.enum";
import {Day} from "./day";

export type AddOrUpdateSchedule = {
    id: string;
    day: Day;
    timeStart?: string;
    timeFinish?: string;
    disciplineId: string;
    scheduleType: ScheduleType;
    auditoryId?: string;
    teacherId: string;
    groupId: string;
    time: string;
}