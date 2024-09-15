import ApiResponse from "../utils/ApiResponse.js";
import Order from "../models/order.model.js"
import { isValidObjectId } from "mongoose";
import Product from "../models/product.model.js";

const placeOrder = async (req, res) => {
    const { vendor, cart, paymentMethod, paymentImg, description } = req.body

    if ((paymentMethod !== "cash") && !paymentImg) return res.status(404).json(new ApiResponse(404, null, "Payment img required"))

    if (!isValidObjectId(vendor)) return res.status(400).json(new ApiResponse(400, "", "Vendor not vendorId"))

    for (let prod of cart) {
        const product = await Product.findById(prod.product).select("name price")
        if (!product) return res.status(400).json(new ApiResponse(400, null, "Product not found."))
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


// CHANGE ORDER STATUS
const manageOrder = async (req, res) => {
    const { orderId } = req.params
    if (!orderId || !isValidObjectId(orderId)) return res.status(400).json(new ApiResponse(400, null, "OrderId missing"))

    const { orderStatus, description } = req.body
    if (!orderStatus) return res.status(400).json(new ApiResponse(400, null, "Order status missing"))

    const statuses = ["pending", "accepted", "incomplete", "undelivered", "delivered", "failed", "cancelled"]
    if (!statuses.includes(orderStatus)) {
        return res.status(400).json(new ApiResponse(400, null, "Order status invalid."))
    }

    if (((orderStatus == "cancelled") && (req.user.userType !== "customer"))) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid order status change"))
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json(new ApiResponse(404, null, "Order not found"));

    const cond1 = (order.orderStatus == "pending" && ["accepted", "rejected", "cancelled"].includes(orderStatus))
    const cond2 = (order.orderStatus == "accepted" && ["incomplete", "failed", "delivered"].includes(orderStatus))

    if (!(cond1 || cond2)) return res.status(400).json(new ApiResponse(400, null, "Invalid order status change"))

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


// ORDER BY ID
const getOrderById = async (req, res) => {
    const { orderId } = req.params
    if (!orderId) return res.status(400).json(new ApiResponse(400, null, "Order Id missing."))

    const order = await Order.findById(orderId)
    if (!order) return res.status(400).json(new ApiResponse(400, null, "Order not found."))

    return res.status(200).json(new ApiResponse(200, order, "Order fetched."))
}

// TODAY'S ORDERS
const getTodaysOrders = async (req, res) => {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()

    const todaysOrder = await Order.find({
        vendor: req.user._id,
        orderStatus: { $in: ["pending", "accepted", "rejected", "delivered"] },
        createdAt: { $gte: startOfDay }
    })
        .sort({ createdAt: -1 })
        .select("createdAt customer bill orderItems orderStatus")
        .populate({
            path: "customer",                   // Populate the customer field
            select: "username location"         // Only fetch username and location fields
        })
        .lean();  // Optional: use .lean() if you only need plain JavaScript objects, not Mongoose documents

    // Modify the data after fetching it
    const modifiedOrders = todaysOrder.map(order => ({
        ...order,
        products: order.orderItems.length,
        orderItems: order.orderItems.slice(0, 2)  // Limit orderItems to the first 2 items
    }));


    if (!todaysOrder) return res.status(400).json(new ApiResponse(400, null, "Orders unable to fetch."))

    return res.status(200).json(new ApiResponse(200, modifiedOrders, "Order fetched."))
}


// TIME PERIODS 
const now = new Date()

const past7Days = new Date()
past7Days.setDate(now.getDate() - 7)

const past30Days = new Date()
past30Days.setDate(now.getDate() - 30)

const pastYear = new Date()
pastYear.setMonth(now.getMonth() - 12)

const limit = {
    week: past7Days,
    month: past30Days,
    year: pastYear
}


// ORDER HISTORY
const getOrderHistory = async (req, res) => {
    const userId = req.user._id

    const { duration } = req.params
    if (!duration) return res.status(200).json(new ApiResponse(200, history, "Duration required"))

    const history = await Order.find({
        createdAt: { $gte: limit[duration] },
        $or: [{ customer: userId }, { vendor: userId }]
    })
        .select("customer bill orderStatus orderItems createdAt")
        .populate({
            path: "customer", select: "username"
        })
        .lean()

    const modifiedHistory = history.map(order => ({
        ...order,
        orderItems: order.orderItems.length,
    }));

    return res.status(200).json(new ApiResponse(200, modifiedHistory, "Order history fetched"))
}


// ORDERS OVERVIEW
const orderOverview = async (req, res) => {
    const userId = req.user._id

    const { duration } = req.params
    if (!duration) return res.status(200).json(new ApiResponse(200, history, "Duration required"))

    const overview = await Order.find({
        createdAt: { $gte: limit[duration] },
        vendor: userId
    })
        .select("bill orderStatus")

    const total = overview.reduce((sum, curr) => {
        return sum + curr.bill
    }, 0)
   overview.push({total})

    return res.status(200).json(new ApiResponse(200, overview, "Order overview fetched"))
}

export {
    placeOrder,
    manageOrder,
    getOrderById,
    getOrderHistory,
    getTodaysOrders,
    orderOverview,
}