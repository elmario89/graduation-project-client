import {Teacher} from "./teacher";

export type Discipline = {
    id: string;
    name: string;
    teachers?: Teacher[];
}