import ApiResponse from "../utils/ApiResponse.js";
import Order from "../models/order.model.js"
import { isValidObjectId } from "mongoose";
import Product from "../models/product.model.js";

const placeOrder = async (req, res) => {
    const { vendor, cart, paymentMethod, paymentImg, description } = req.body

    if ((paymentMethod !== "cash") && !paymentImg) return res.status(404).json(new ApiResponse(404, null, "Payment img required"))

    if (!isValidObjectId(vendor)) return res.status(400).json(new ApiResponse(400, "", "Vendor not vendorId"))

    for (let prod of cart) {
        const product = await Product.findById(prod.product)
        prod.product = product
    }

    const order = await Order.create({
        customer: req.user._id,
        vendor,
        orderItems: cart,
        paymentMethod,
        paymentImg,
        description: { customer: description }
    })
    if (!order) return res.status(500).json(new ApiResponse(500, null, "Something went wrong while placing the order"))

    return res.status(201).json(new ApiResponse(201, order, "Order placed successfully"))
}

const manageOrder = async (req, res) => {
    const { orderId } = req.params
    if (!orderId || !isValidObjectId(orderId)) return res.status(400).json(new ApiResponse(400, null, "OrderId missing"))

    const { orderStatus, description } = req.body
    if (!orderStatus) return res.status(400).json(new ApiResponse(400, null, "Order status missing"))

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json(new ApiResponse(404, null, "Order not found"));

    // Update the order fields
    order.orderStatus = orderStatus;
    order.description = {
        ...order.description, // Preserve existing customer field
        vendor: description   // Update only the vendor field
    };

    // Save the updated order
    const updatedOrder = await order.save();

    if (!updatedOrder) return res.status(500).json(new ApiResponse(500, null, "Order didn't update"))

    return res.status(200).json(new ApiResponse(200, updatedOrder, "Order recieved"))
}

const getOrderHistory = async (req, res) => {
    const userId = req.user._id

    const history = await Order.find({ $or: [{ customer: userId }, { vendor: userId }] })

    return res.status(200).json(new ApiResponse(200, history, "Order history fetched"))
}


export {
    placeOrder,
    manageOrder,
    getOrderHistory,
}