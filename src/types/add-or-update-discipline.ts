import {Discipline} from "./discipline";

export type AddOrUpdateDiscipline = Omit<Discipline, 'teachers'>;