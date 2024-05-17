import { Building } from "./building";
import { Coordinate } from "./coordinate";

export type Auditory = {
    id: string;
    number: number;
    floor: number;
    coordinates: Coordinate[];
    building: Building;
    buildingId: string;
}