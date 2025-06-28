import { IDBModel } from "../../utils/general";

export interface ITable extends Omit<IDBModel, 'location'> {
    number: number;
    isAvailable: boolean;
    location: TableLocations;
}

export enum TableLocations {
    INSIDE = 'inside', 
    OUTSIDE = 'outside'
}

export interface ICreateTable {
    number: number;
    location: TableLocations;
}
