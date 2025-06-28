import Meal from "../Meal/meal.schema";
import ApiError from "../../utils/apiErrors";
import { pagenation } from "../../utils/pagination";
import { orderRepository } from "./order.repository";
import { ICreateOrderData, ICreateOrderQuery, IOrder, IOrderMealItem } from "./order.types";
import { FilterQuery } from "mongoose";
import { Order } from "./order.schema";
import stockOutflowSchema from "../StockOutflow/stockOutflow.schema";
import stockSchema from "../Stock/stock.schema";
import { shiftService } from "../Shift/shift.service";
import { shiftRepository } from "../Shift/shift.repository";
import { tableService } from "../Table";
import { OrderTypesEnum } from "./order.types";
class OrderService {

    constructor(private readonly orderdDataSource = orderRepository) {}

    async isOrderExist(orderId: string) {
        const order = await this.orderdDataSource.findOne({ _id : orderId});
        if (!order) {
            throw new ApiError('الطلب غير موجود', 404);
        }
        return order;
    }

    async findOrderById(orderId: string) {
        return this.orderdDataSource.findOne({ _id : orderId});
    }

    async updateOrder({ orderId, data }: { orderId: string, data: Partial<IOrder> }) {
        const updatedOrder = await this.orderdDataSource.updateOne({_id : orderId}, data);
        if (!updatedOrder) {
            throw new ApiError('Failed to update order', 500);
        }
        return updatedOrder;
    }

    async createOrder(data: ICreateOrderQuery) {
        try {
            const { orderItems, cashierId, type, custName, custPhone, custAddress, shiftId, tableNumber } = data;

            let orderObject: ICreateOrderData = {} as ICreateOrderData;
            

              // check table 
               if (type === OrderTypesEnum.DINEIN) { ///
                if (!tableNumber) {
                    throw new ApiError('يجب عليك تحديد الطاولة', 400)
                }
                //! Check if table is exist
                const table = await tableService.isTableAvalible(tableNumber);
                if(!table) {
                    throw new ApiError('Table not found or not available', 404);
                }
                orderObject.tableNumber = tableNumber;
            }


            //! Check is all meal availbale
            let totalPrice = 0;
            const newOrderItems: IOrderMealItem[] = [];
            let allItemsCount = 0;

            for(const item of orderItems) {
                const meal = await Meal.findById(item.mealId);
                allItemsCount += item.quantity
                if (!meal || !meal?.isAvailable) {
                    throw new ApiError('Meal not available now', 404);
                }
                
                // console.log(meal)
                // console.log(meal.departmentId)

                const mealObj = meal.toObject();
                console.log(mealObj)

                totalPrice += meal.price * item.quantity;
                newOrderItems.push({
                    mealId: item.mealId,
                    quantity: item.quantity,
                    price: mealObj.price,
                    isCancelled: false,
                    note: item?.note || ""
                });
            }
            orderObject.orderItems = newOrderItems;
            orderObject.totalPrice = totalPrice;
            orderObject.type = type;
            if(custName) orderObject.custName = custName;
            if(custPhone) orderObject.custPhone = custPhone;
            if(custAddress) orderObject.custAddress = custAddress;
            if(shiftId) orderObject.shiftId = shiftId;
            if(cashierId) orderObject.cashierId = cashierId;
            
            const order = await this.orderdDataSource.createOne(orderObject);


            
            //////// إذا كان الطلب مدفوعًا، قم بتحديث حالة الدفع
        if ( order && orderObject.isPaid) {
            await this.markOrderAsPaid(order._id.toString());
        }


            if (tableNumber) {
                await tableService.updateTable({ tableNumber, data: { isAvailable: false } });
            }

            // update shift data
            await shiftRepository.updateOne(
                { _id: shiftId },
                { $inc: { allOrdersCount: 1, notPaidOrdersCount: 1, soldItemsCount: allItemsCount } }
            );
            
            return order;
        } catch (error) {
            console.log(error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Failed to create order', 500);
        }
    }
      
    async addMealToOrder({ orderId, orderItem }: { orderId: string, orderItem: { mealId: string, quantity: number, note?: string } }) {
        try {
            let { orderItems, totalPrice } = await this.isOrderExist(orderId);
            
            const meal = await Meal.findById(orderItem.mealId);
            if (!meal || !meal?.isAvailable) {
                throw new ApiError('Meal not available now', 404);
            }

            const mealObj = meal.toObject();
            console.log(mealObj)

            //! Update order items if meal is already in order
            orderItems = orderItems.filter(item => item.mealId.toString() !== orderItem.mealId.toString());
            orderItems.push({
                mealId: orderItem.mealId,
                quantity: orderItem.quantity,
                price: meal.price,
                isCancelled: false,
                note: orderItem?.note || ""
            });
            
            totalPrice = orderItems.reduce(
                (acc, item) => acc + (item.isCancelled ? 0 : item.price * item.quantity), 0
            );
           
            const updatedOrder = await this.orderdDataSource.updateOne(
                { _id: orderId }, 
                { totalPrice, orderItems }) as IOrder;
            
            // update shift data
            await shiftRepository.updateOne(
                { _id: updatedOrder?.shiftId },
                { $inc: { soldItemsCount: orderItem.quantity } }
            );

            return updatedOrder;
        } catch (error) {
            console.log(error)
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to add meal to order', 500);
        }
    }

    async deleteMealFromOrder({ orderId, mealId: mealIdData }: { orderId: string, mealId: string }) {
        try {
            const order = await this.isOrderExist(orderId);
            
            // Update the orderItems array directly
            const orderItems = order.orderItems.map(item => {
                // console.log(item.mealId.toString(), mealIdData)
                const { isCancelled, mealId, price, quantity, note } = item;
                return item.mealId.toString() === mealIdData.toString() 
                    ? { 
                        mealId, price, quantity, note,
                        isCancelled: true 
                    }
                    : {
                        isCancelled, mealId, price, quantity, note
                    }
            });

            // console.log(orderItems);

            const totalPrice = orderItems.reduce(
                (acc, item) => acc + (item.isCancelled ? 0 : item.price * item.quantity), 0
            );

            const updatedOrder = await this.orderdDataSource.updateOne(
                { _id: orderId },
                { $set: { orderItems, totalPrice } }
            );
            
            if (!updatedOrder) {
                throw new ApiError('Failed to update order', 500);
            }
            
            return updatedOrder;
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to delete meal from order', 500);
        }
    }

    async deleteOrder(orderId: string) {
        try {
            await this.isOrderExist(orderId);
            const result = await this.orderdDataSource.deleteOne({_id : orderId});
            if(!result) throw new ApiError('Failed to delete order', 500);
            return result;
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to delete order', 500);
        }
    }

    async getAllOrders({ page, size, date, cashierId, shiftId }: { page: number, size: number, date?: Date, cashierId?: string, shiftId?: string }) {
        try {
            const query: any = {};
            if (date) {
                query.createdAt = { $gte: date };
            }
            if (cashierId) {
                query.cashierId = cashierId;
            }
            if (shiftId) {
                query.shiftId = shiftId;
            }
            console.log(query);
            const { limit, skip } = pagenation({ page, size });
            return this.orderdDataSource.findMany(query, { limit, skip });       
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('failed to get orders', 500);
        }
    }


       async changeTable({ orderId, tableNumber }: { orderId: string, tableNumber: number }) {
        try {
            const order = await this.isOrderExist(orderId);
            if (order.type === OrderTypesEnum.TAKEAWAY && !order?.tableNumber) {
                throw new ApiError('هذا الطلب ليس لديه طاولات', 400)
            }

            const table = await tableService.isTableAvalible(tableNumber);
            if(!table) {
                throw new ApiError('Table not found or not available', 404);
            }
            if(order.tableNumber === tableNumber) {
                throw new ApiError('Table is already assigned to this order', 400);
            }

            const updatedOrder = await this.orderdDataSource.updateOne({ _id: orderId }, { tableNumber });
            
            if (order?.tableNumber) {
                await tableService.updateTable({ tableNumber: order?.tableNumber, data: { isAvailable: true } });
                await tableService.updateTable({ tableNumber, data: { isAvailable: false } });
            }
            
            return updatedOrder; 
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to change table', 500);
        }
    }


    async findOne(query: FilterQuery<IOrder>) {
        const order = await this.orderdDataSource.findOne(query);
        if(!order) {
            throw new ApiError('الطلب غير موجود', 404)
        }
        return order;
    }
    
    async getOrderByCode(orderCode: string) {
        return await this.findOne({ orderCode })
    }

    async getOrderById(orderId: string) {
        return await this.findOne({ _id: orderId })  
    }

     async getOrderByTable(tableNumber: number) {
        return await this.findOne({ tableNumber, isPaid: false });
    }

    async cancelOrder(orderId: string) {
        try {
            const order = await this.isOrderExist(orderId);
            if(order.isCancelled) {
                throw new ApiError('Order is already cancelled', 400);
            }
            if(order.isPaid) {
                throw new ApiError('Order is already paid cannot cancelled it', 400);
            }
            
            const cancelledOrder = await this.orderdDataSource.updateOne({ _id: orderId }, { isCancelled: true });

            if (order.tableNumber) {
                await tableService.updateTable({
                    tableNumber: order.tableNumber,
                    data: { isAvailable: true }
                });
            }

            // update shift data
            await shiftRepository.updateOne(
                { _id: order.shiftId },
                { $inc: {  notPaidOrdersCount: -1, cancelledOrdersCount: 1 } }
            );
            return cancelledOrder
        } catch (error) {
            if(error instanceof ApiError) throw error
            throw new ApiError('Failed to cancel order', 500);
        }
    }

    async markOrderAsPaid(orderId: string): Promise<IOrder> {
        // 1. الحصول على الطلب مع الوجبات
        const order = await Order.findById(orderId)
          .populate({
            path: 'orderItems.mealId',
            populate: { path: 'ingredients.stockItemId' }
          });
        
        // 1. التحقق من وجود الطلب
        if (!order) {
          throw new ApiError('Order not found', 404);
        }
        
        // 1. التحقق من وجود الطاولة
        if (order.tableNumber){
            await tableService.updateTable(
                {
                    tableNumber: order.tableNumber,
                    data: { isAvailable: true }
                }
            )
        }
    
        // 2. التحقق من توفر المخزون
        await this.verifyStockAvailability(order);
    
        // 3. خصم المخزون وتسجيل التدفقات
        await this.deductStockAndRecordOutflows(order);
    
        // // 4. تحديث حالة الطلب
        // order.status = OrderStatus.COMPLETED;
        return await order.save();

    ;
    }
    
      private async verifyStockAvailability(order: IOrder): Promise<void> {
        const insufficientItems: string[] = [];
    
        for (const item of order.orderItems) {
          const meal = item.mealId as any;
          
          for (const ingredient of meal.ingredients) {
            const stock = await stockSchema.findById(ingredient.stockItemId);
            const requiredQuantity = ingredient.quantityUsed * item.quantity;
    
            if (!stock || stock.quantity < requiredQuantity) {
              insufficientItems.push(
                `${meal.name} - ${stock?.name || 'Unknown'} (Needed: ${requiredQuantity}, Available: ${stock?.quantity || 0})`
              );
            }
          }
        }
    
        if (insufficientItems.length > 0) {
          throw new ApiError(`Insufficient stock for: ${insufficientItems.join(', ')}`, 400);
        }
      }
    
      private async deductStockAndRecordOutflows(order: IOrder): Promise<void> {
        for (const item of order.orderItems) {
          const meal = item.mealId as any;
    
          for (const ingredient of meal.ingredients) {
            const quantityUsed = ingredient.quantityUsed * item.quantity;
    
            // خصم من المخزون
            await stockSchema.findByIdAndUpdate(
              ingredient.stockItemId,
              { $inc: { quantity: -quantityUsed } }
            );
    
            // تسجيل تدفق المخزون
            await stockOutflowSchema.create({
              stockItemId: ingredient.stockItemId,
              orderId: order._id,
              quantityUsed,
              date: new Date()
            });
          }
        }
      }


}






export const orderService = new OrderService() 
