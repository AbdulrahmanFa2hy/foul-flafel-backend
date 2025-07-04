import { IDBModel } from "../../utils/general";
import { Types } from "mongoose";
import { Meal } from "../Meal/meal.interface";
import { Users } from "../User/users.interface";

export interface IOrder extends IDBModel {
    cashierId: string;
    shiftId: string;
    orderCode: string;
    orderItems: IOrderMealItem[];
    totalPrice: number;
    isPaid: boolean;
    isCancelled: boolean;  
    cashierData?: Users;
    orderItemsData?: Meal[];
    type: OrderTypesEnum;
    tableNumber?: number;
    custName?: string;
    custtPhone?: string;
    custAddress?: string;
}

export interface ICreateOrderQuery {
    cashierId: string;
    shiftId: string;
    type: OrderTypesEnum;
    tableNumber?: number;
    isPaid?: boolean;
    custName?: string;
    custPhone?: string;
    custAddress?: string;
    orderItems: {
        mealId: string;
        quantity: number;
        note?: string;
    }[];
}

export enum OrderTypesEnum {
    TAKEAWAY = 'takeaway',
    DELIVERY = 'delivery',
    DINEIN = 'dinein'
}

export interface ICreateOrderData extends ICreateOrderQuery {
    totalPrice: number; 
    orderItems: IOrderMealItem[];
    stockOutflows?: (string | Types.ObjectId)[] | undefined ; 
    
}

export interface IOrderMealItem {
    mealId: string;
    quantity: number;
    price: number;
    isCancelled: boolean;
    note?: string;
}