import ApiError from "../../utils/apiErrors";
import { tableRepository } from "./table.repository";
import { Table } from "./table.schema";
import { ICreateTable, ITable, TableLocations } from "./table.types";


class TableService {
    constructor(private readonly tableDataSource = tableRepository) {}

    async isTableExists(number: number) {
        const table = await this.tableDataSource.findOne({ number })
        return !!table
    }

    async isTableAvalible(number: number) {
        const table = await this.tableDataSource.findOne({ number, isAvailable: true })
        return !!table
    }

    async createTable(data: ICreateTable) {
        try {
            const { number } = data;
            const isTableExists = await this.isTableExists(number)
            if (isTableExists) {
                throw new ApiError("Table number already exists", 400)
            }
            return this.tableDataSource.createOne(data);
        } catch (error) {
            console.log(error);
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError("Failed to create table", 500)
        }
    }

    async updateTable({ tableNumber, data }: { tableNumber: number, data: Partial<ITable> }) {
        try {
            const updatedTable = await this.tableDataSource.updateOne({ number: tableNumber }, data )
            return updatedTable
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError("Failed to update table", 500)
        }
    }

    async deleteTable(tableNumber: number) {
        try {
            const deletedTable = await this.tableDataSource.deleteOne({ number: tableNumber })
            return deletedTable
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError("Failed to delete table", 500)
        }
    }

    async getAllTables({ isAvailable, location }: { isAvailable?: boolean, location?: TableLocations }) {
        try {
            
            let query: { isAvailable?: boolean, location?: TableLocations } = {}
            if (location) {
                query.location = location
            }
            const table = await this.tableDataSource.findMany(query)
            return table
        } catch (error) {
            if (error instanceof ApiError) {
                throw error
            }
            throw new ApiError("Failed to get all tables", 500)
        }
    }
}

export const tableService = new TableService(tableRepository)