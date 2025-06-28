import { model, Schema } from "mongoose";
import { ITable, TableLocations } from "./table.types";

const tableSchema = new Schema({
    number: {
        type: Number,
        unique: true,
        index: true,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    location: {
        type: String,
        enum: Object.values(TableLocations),
        required: true
    }
}, {
    timestamps: true
})

export const Table = model<ITable>('Table', tableSchema)

