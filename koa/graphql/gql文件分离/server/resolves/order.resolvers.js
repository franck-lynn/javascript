import { Order } from "../model/orderModel"

const orderQuery = {
    Query: {
        orders: async() => {
            return await Order.find()
        }
    }
}

export default orderQuery


