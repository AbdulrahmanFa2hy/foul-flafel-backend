import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { addTableSchema, getAllTablesSchema, getTableByNumberSchema, updateTableSchema } from "./table.validation";
import { tableService } from "./table.service";
import { params } from "../../utils/general";

const addTable = async (req: AuthRequest, res: Response) => {
    const { number, location } = addTableSchema.parse(req.body);

    const newTable = await tableService.createTable({ number, location });

    res.status(201).json({ 
        success: true,
        message: "Table created successfully",
        data: newTable 
    });
}
const updateTable = async (req: AuthRequest, res: Response) => {
    const { tableNumber } = getTableByNumberSchema.parse(req.params);
    const { number, location } = updateTableSchema.parse(req.body);

    const updatedTable = await tableService.updateTable({ tableNumber, data: { number, location } });

    res.status(200).json({ 
        success: true,
        message: "Table updated successfully",
        data: updatedTable 
    });
}

const deleteTable = async (req: AuthRequest, res: Response) => {
    const { tableNumber } = getTableByNumberSchema.parse(req.params);

    const deletedTable = await tableService.deleteTable(tableNumber);

    res.status(200).json({ 
        success: true,
        message: "Table deleted successfully",
        data: deletedTable 
    });
}

const getAllTables = async (req: AuthRequest, res: Response) => {
    console.log('Query before validation:', req.query);  // Should show { isAvailable: 'false' }
    const { isAvailable, location } = getAllTablesSchema.parse(req.query);
    console.log('After validation:', { isAvailable, location });  // Should show { isAvailable: false }
    
    const tables = await tableService.getAllTables({ isAvailable, location });

    res.status(200).json({ 
        success: true,
        message: "Tables fetched successfully",
        data: tables 
    });
}

export const tableCtrl = {
    addTable,
    updateTable,
    deleteTable,
    getAllTables
}


