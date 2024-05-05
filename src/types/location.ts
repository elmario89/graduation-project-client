import { Coordinate } from "./coordinate";

export type Location = {
    id: string;
    buildingNumber: number;
    auditory: number;
    floor: number;
    address: string;
    coordinates: Coordinate[];
}