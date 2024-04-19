import {Group} from "./group";

export type Faculty = {
    id: string;
    name: string;
    groups?: Group[];
}