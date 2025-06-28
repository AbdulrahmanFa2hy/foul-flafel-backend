import { FilterQuery, Model, UpdateQuery } from "mongoose";
import { ITable } from "./table.types";
import { Table } from "./table.schema";

class TableRepository<T = ITable> {

    constructor(private readonly tableModel: Model<T>) {}

    async createOne(data: Partial<T>): Promise<T> {
        return this.tableModel.create(data);
    }

    async updateOne(query: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
        return this.tableModel.findOneAndUpdate(query, data, { new: true });
    }

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return this.tableModel.findOne(query);
    }

    async findMany(query: FilterQuery<T>): Promise<T[]> {
        return this.tableModel.find(query);
    }

    async deleteOne(query: FilterQuery<T>): Promise<boolean> {
        const result = await this.tableModel.deleteOne(query);
        return result.deletedCount > 0;
    }
}

export const tableRepository = new TableRepository(Table);

