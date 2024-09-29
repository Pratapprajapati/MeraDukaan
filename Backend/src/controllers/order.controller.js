import ApiResponse from "../utils/ApiResponse.js";
import Order from "../models/order.model.js"
import mongoose, { isValidObjectId } from "mongoose";
import Product from "../models/product.model.js";
import Customer from "../models/customer.model.js";

const placeOrder = async (req, res) => {
    const { vendor, description } = req.body
    if (!isValidObjectId(vendor)) return res.status(400).json(new ApiResponse(400, "", "Vendor not vendorId"))

    const customerCart = await Customer.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(req.user._id) } // Match the customer by ID
        },
        {
            $unwind: "$cart" // Unwind the cart array to work on each cart item separately
        },
        {
            $match: { "cart.vendor": new mongoose.Types.ObjectId(vendor) } // Filter cart items for the specific vendor
        },
        {
            $lookup: {
                from: "products",
                localField: "cart.product", // productId stored in the cart
                foreignField: "_id",
                as: "productDetails"
            }
        },
        {
            $unwind: "$productDetails" // Unwind product details since lookup returns an array
        },
        {
            $lookup: {
                from: "inventories",
                let: { vendorId: "$cart.vendor", productId: "$cart.product" }, // Match vendor and product IDs
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$vendorId"] // Match inventory by vendor ID
                            }
                        }
                    },
                    {
                        $project: {
                            productDetails: {
                                $filter: {
                                    input: "$productList",
                                    as: "productItem",
                                    cond: { $eq: ["$$productItem.product", "$$productId"] } // Match product within productList
                                }
                            }
                        }
                    },
                    {
                        $unwind: "$productDetails" // Unwind the product details from the inventory
                    }
                ],
                as: "inventoryDetails"
            }
        },
        {
            $unwind: {
                path: "$inventoryDetails", // Unwind inventory details if available
                preserveNullAndEmptyArrays: true // Allow null inventory details if not found
            }
        },
        {
            $project: {
                _id: 1,
                "cart.product": {
                    _id: "$productDetails._id",
                    price: "$productDetails.price", // Product price (fallback)
                },
                "cart.inventoryDetails": {
                    price: {
                        $ifNull: ["$inventoryDetails.productDetails.price", "$productDetails.price"] // Use inventory price, or fallback to product price
                    },
                    stock: "$inventoryDetails.productDetails.stock" // Stock info from the inventory
                },
                "cart.count": "$cart.count", // Keep the count as it is
            }
        }
    ]);

    // If no cart found for the vendor, return an error
    if (!customerCart.length) {
        return res.status(404).json(new ApiResponse(404, null, "Cart not found for this vendor"));
    }

    // Group the products for the specific vendor
    let vendorCart = customerCart.map(item => ({
        product: { _id: item.cart.product._id },
        count: item.cart.count,
        stock: item.cart.inventoryDetails ? item.cart.inventoryDetails.stock : null,
        total: item.cart.count * (item.cart.inventoryDetails ? item.cart.inventoryDetails.price : item.cart.product.price)  // Calculate total here
    }));

    const order = await Order.create({
        customer: req.user._id,
        vendor,
        orderItems: vendorCart,
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

    const statuses = ["pending", "accepted", "rejected", "incomplete", "undelivered", "delivered", "failed", "cancelled"]
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

    if (orderStatus === "accepted") {
        let code = Math.floor(100000 + Math.random() * 900000)
        order.code = code
    }

    if (orderStatus === "delivered" && order?.code != code) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid code"))
    }

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
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json(new ApiResponse(400, null, "Order Id missing."));

    const order = await Order.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
        {
            $lookup: {
                from: "customers",
                localField: "customer",
                foreignField: "_id",
                as: "customerDetails"
            }
        },
        {
            $lookup: {
                from: "vendors",
                localField: "vendor",
                foreignField: "_id",
                as: "vendorDetails"
            }
        },
        { $unwind: "$customerDetails" },
        { $unwind: "$vendorDetails" },
        {
            $lookup: {
                from: "products",
                localField: "orderItems.product",
                foreignField: "_id",
                as: "productDetails",
                pipeline: [
                    {
                        $project: {
                            name: 1, image: 1, subCategory: 1,
                        }
                    }
                ]

            }
        },
        {
            $unwind: {
                path: "$productDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: "$_id",
                bill: { $first: "$bill" },
                orderStatus: { $first: "$orderStatus" },
                description: { $first: "$description" },
                code: { $first: "$code" },
                createdAt: { $first: "$createdAt" },
                updatedAt: { $first: "$updatedAt" },
                customer: { $first: "$customerDetails" },
                vendor: { $first: "$vendorDetails" },
                orderItems: {
                    $push: {
                        product: {
                            _id: "$productDetails._id",
                            name: "$productDetails.name",
                            subCategory: "$productDetails.subCategory",
                            image: "$productDetails.image"
                        },
                        count: { $arrayElemAt: ["$orderItems.count", { $indexOfArray: ["$orderItems.product", "$productDetails._id"] }] },
                        total: { $arrayElemAt: ["$orderItems.total", { $indexOfArray: ["$orderItems.product", "$productDetails._id"] }] }
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                customer: {
                    _id: "$customer._id",
                    username: "$customer.username",
                    contact: "$customer.contact.primary",
                    location: "$customer.location"
                },
                vendor: {
                    _id: "$vendor._id",
                    shopName: "$vendor.shopName",
                    contact: "$vendor.contact.primary",
                    location: "$vendor.location",
                    delivery: "$vendor.delivery",
                    isOpen: "$vendor.isOpen"
                },
                orderItems: 1,
                bill: 1,
                orderStatus: 1,
                code: 1,
                createdAt: 1,
                updatedAt: 1,
                description: 1,
            }
        }
    ]);

    if (!order || order.length === 0) return res.status(404).json(new ApiResponse(404, null, "Order not found."));

    return res.status(200).json(new ApiResponse(200, order[0], "Order fetched."));
};


// TODAY'S ORDERS
const getOrders = async (req, res) => {
    const { status } = req.params;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const yesterdayStart = new Date(startOfDay);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);

    const duration = req.user?.userType == "vendor" ? startOfDay : yesterdayStart
    const searchIn = req.user?.userType == "vendor" ? { vendor: req.user._id } : { customer: req.user._id }

    const matchConditions = {
        ...searchIn,
        createdAt: { $gte: duration }
    };

    if (status !== "all") matchConditions.orderStatus = status;

    const orders = await Order.aggregate([
        {
            $match: matchConditions
        },
        { $sort: { createdAt: -1 } },
        {
            $lookup: {
                from: 'customers',
                localField: 'customer',
                foreignField: '_id',
                as: 'customer'
            }
        },
        {
            $unwind: '$customer'
        },
        {
            $lookup: {
                from: 'vendors',
                localField: 'vendor',
                foreignField: '_id',
                as: 'vendor',
                pipeline: [
                    {
                        $project: { shopName: 1, location: 1, isOpen: 1 }
                    }
                ]
            }
        },
        {
            $unwind: '$vendor'
        },
        {
            $lookup: {
                from: 'products',                 // Replace 'products' with the actual product collection name
                localField: 'orderItems.product',
                foreignField: '_id',
                as: 'productDetails',
                pipeline: [{
                    $project: {
                        name: 1, subCategory: 1,
                    }
                }]
            }
        },
        {
            $project: {
                createdAt: 1,
                vendor: 1,
                customer: { username: 1, location: 1 },
                orderItems: 1,
                orderStatus: 1,
                bill: 1,
                products: { $size: "$orderItems" },    // Add number of products
                productDetails: { $slice: ["$productDetails", 2] }  // Limit products to first 2
            }
        }
    ]);

    if (!orders || orders.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No orders found for today."));
    }

    // Modify the data as needed for the response
    const modifiedOrders = orders.map(order => ({
        ...order,
        orderItems: order.orderItems.map((item, index) => ({
            ...item,
            productName: order.productDetails[index] ? order.productDetails[index].name : "Unknown"  // Attach product name to each item
        }))
    }));

    return res.status(200).json(new ApiResponse(200, modifiedOrders, "Orders fetched."));
};


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
        .populate({
            path: "vendor", select: "shopName location contact"
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
    if (!duration) return res.status(400).json(new ApiResponse(400, history, "Duration required"))

    const overview = await Order.find({
        createdAt: { $gte: limit[duration] },
        vendor: userId,
        orderStatus: { $in: ["delivered", "incomplete", "rejected", "failed"] }
    })
        .select("bill orderStatus")

    const total = overview.reduce((sum, curr) => {
        if (curr.orderStatus == "delivered") sum + curr.bill
        return sum
    }, 0)

    return res.status(200).json(new ApiResponse(200, { overview, total }, "Order overview fetched"))
}

export {
    placeOrder,
    manageOrder,
    getOrderById,
    getOrderHistory,
    getOrders,
    orderOverview,
}