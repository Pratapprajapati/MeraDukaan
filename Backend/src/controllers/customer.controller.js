import mongoose from "mongoose"
import ApiResponse from "../utils/ApiResponse.js"
import Customer from "../models/customer.model.js"
import Inventory from "../models/inventory.model.js"
import Order from "../models/order.model.js"
import Review from "../models/review.model.js"
import Product from "../models/product.model.js"
import CryptoJS from 'crypto-js'

const register = async (req, res) => {

    const { username, email, age, password, primary, secondary, address, city, pincode } = req.body

    const existingUser = await Customer.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) return res.status(400).json(new ApiResponse(400, "User with email or username already exists"))

    const user = await Customer.create({
        username,
        email,
        age,
        password,
        contact: { primary, secondary },
        location: { address, city, pincode }
    })
    if (!user) return res.status(500).json(new ApiResponse(500, "Something went wrong!"))

    const customer = await Customer.findById(user?._id).select("-password")

    return res.status(201).json(new ApiResponse(201, customer, "Customer created!"))
}

const generateAccessAndRefreshTokens = async (customerId) => {
    try {
        const customer = await Customer.findById(customerId)

        const accessToken = customer.generateAccessToken()
        const refreshToken = customer.generateRefreshToken()

        customer.refreshToken = refreshToken                // save the refreshToken in customer's db
        await customer.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        return res.json(new ApiResponse(500, [], "Something went wrong while generation tokens!"))
    }
}

// Cookies cannot be accessed by client-side scriptsand are sent by HTTPS only 
const options = { httpOnly: true, secure: true }

// LOGIN
const login = async (req, res) => {
    // Fetch username or email and password
    const { username, email, password } = req.body
    if (!username && !email) new ApiResponse(400, null, "Username or Email is required!!")

    const user = await Customer.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) return res.status(400).json(new ApiResponse(400, null, "Incorrect username or email"))

    const validPassword = await user.isPasswordCorrect(password)
    if (!validPassword) return res.status(400).json(new ApiResponse(400, null, "Password incorrect"))

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const customer = await Customer.findById(user?._id).select("-password -refreshToken")

    const customerData = CryptoJS.AES.encrypt(JSON.stringify(customer), "secretKey").toString()

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .cookie("user", customerData)
        .json(
            new ApiResponse(
                200,
                {
                    customer, accessToken, refreshToken
                },
                "Customer logged in successfully!!"
            )
        )
}

// LOGOUT
const logout = async (req, res) => {
    await Customer.findByIdAndUpdate(
        req.user?._id,
        { $unset: { refreshToken: 1 } }
    )

    return res.status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .clearCookie("user")
        .json(new ApiResponse(200, {}, "User logged out successfully!!"))
}

// UPDATE USER
const updateCustomer = async (req, res) => {
    const body = req.body

    const curUser = req.user._id
    if (!curUser) return res.status(400).json(new ApiResponse(400, "No user"))

    const user = await Customer.findById(req.user._id)

    if (body.email) user.email = body.email
    if (body["contact.primary"]) user.contact.primary = body["contact.primary"]
    if (body["contact.secondary"]) user.contact.secondary = body["contact.secondary"]
    if (body["location.address"]) user.location.address = body["location.address"]
    if (body["location.area"]) user.location.area = body["location.area"]
    if (body["location.city"]) user.location.city = body["location.city"]
    if (body["location.pincode"]) user.location.pincode = body["location.pincode"]
    user.save({ validateBeforeSave: false })

    const customer = await Customer.findById(user?._id).select(" -cart -password -refreshToken ")

    return res.status(201).json(new ApiResponse(201, customer, "Customer updated!"))
}

// CHANGE PASSWORD
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await Customer.findById(req.user._id).select("password")

    const verify = await user.isPasswordCorrect(oldPassword)
    if (!verify) res.json(new ApiResponse(400, "", "Incorrect password"))

    user.password = newPassword
    user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, "", "Password changed."))
}

// CUSTOMER DETAILS
const getCurrentUser = async (req, res) => {
    const customer = await Customer.findById(req.user._id).select(" -cart -password -refreshToken")
    return res.status(200).json(new ApiResponse(200, customer, "Details fetched"))
}

// ADD TO CART
const addToCart = async (req, res) => {
    const { vendorId, productId, count } = req.body;

    // Validate count
    if (count < 1) {
        return res.status(400).json(new ApiResponse(400, null, "Product count must be at least 1"));
    }

    // Find customer
    const customer = await Customer.findById(req.user._id);
    if (!customer) return res.status(404).json(new ApiResponse(404, null, "Customer not found"));

    // Find inventory of the vendor
    const inventory = await Inventory.findById(vendorId);
    if (!inventory) return res.status(404).json(new ApiResponse(404, null, "Vendor's inventory not found"));

    // Find the product in inventory
    const inventoryProduct = inventory.productList.find(prod => prod.product.toString() === productId);
    if (!inventoryProduct) return res.status(404).json(new ApiResponse(404, null, "Product not found in the vendor's inventory"));

    // Find the product in the main product collection
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json(new ApiResponse(404, null, "Product not found"));

    // Check if stock is sufficient
    if (!inventoryProduct.stock) {
        return res.status(400).json(new ApiResponse(400, null, "Insufficient stock"));
    }

    // Check if the product already exists in the cart
    const cartItemIndex = customer.cart.findIndex(item => item.product.toString() === productId && item.vendor.toString() === vendorId);

    if (cartItemIndex > -1) {
        // If the product is already in the cart, update the count
        customer.cart[cartItemIndex].count += count;
    } else {
        // Otherwise, add it to the cart
        customer.cart.push({
            product: productId,
            vendor: vendorId,
            count
        });
    }

    // Save the updated customer cart
    await customer.save();

    return res.status(200).json(new ApiResponse(200, customer.cart, "Product added to cart successfully"));

};

// CLEAR CART
const clearCart = async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(
        req.user._id,
        { $set: { cart: [] } },
        { new: true }
    ).select("cart")

    return res.status(200).json(new ApiResponse(200, customer, "Cleared cart"))
}

const getCart = async (req, res) => {
    try {
        // Aggregate customer cart with product and inventory details
        const customerCart = await Customer.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.user._id) } // Match the customer by ID
            },
            {
                $unwind: "$cart" // Unwind the cart array to work on each cart item separately
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
                    localField: "cart.vendor",
                    foreignField: "_id",
                    as: "inventoryDetails"
                }
            },
            {
                $unwind: {
                    path: "$inventoryDetails",
                    preserveNullAndEmptyArrays: true // Allow nulls in case no inventory details match
                }
            },
            {
                $project: {
                    _id: 0,
                    "cart.product": {
                        _id: "$productDetails._id",
                        name: "$productDetails.name",
                        category: "$productDetails.category",
                        subCategory: "$productDetails.subCategory",
                        price: "$productDetails.price"
                    },
                    "cart.inventoryDetails": 1,
                    "cart.vendor": "$cart.vendor",
                    "cart.price": {
                        $cond: {
                            if: { $gt: ["$inventoryDetails.price", 0] },
                            then: "$inventoryDetails.price",
                            else: "$productDetails.price"
                        } // If inventory has its own price, use it, else use product price
                    },
                    "cart.count": "$cart.count", // Keep the count as it is
                }
            }
        ]);

        // If no cart found, return an error
        if (!customerCart.length) {
            return res.status(404).json(new ApiResponse(404, null, "Cart not found"));
        }

        // Log the intermediate customerCart to check if inventory details were fetched
        console.log("Customer Cart with Details:", customerCart);

        // Group cart items by vendorId
        let cartByVendor = {};
        customerCart.forEach(item => {
            const vendorId = item.cart.vendor.toString();
            if (!cartByVendor[vendorId]) {
                cartByVendor[vendorId] = [];
            }
            cartByVendor[vendorId].push({
                product: item.cart.product,
                price: item.cart.price,
                count: item.cart.count,
                stock: item.cart.inventoryDetails ? item.cart.inventoryDetails.stock : null,
                description: item.cart.inventoryDetails ? item.cart.inventoryDetails.description : null,
                discount: item.cart.inventoryDetails ? item.cart.inventoryDetails.discount : null
            });
        });

        // Return the cart grouped by vendors
        return res.status(200).json(new ApiResponse(200, cartByVendor, "Cart fetched successfully"));
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch cart"));
    }
};

// ADD REVIEW
const addReview = async (req, res) => {
    const { orderId } = req.params
    if (!orderId) return res.status(404).json(new ApiResponse(404, null, "Order Id missing"))

    const { rating, feedback } = req.body

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json(new ApiResponse(404, null, "Order doesn't exist"))

    if ((order.customer).toString() !== (req.user._id).toString()) {
        return res.status(400).json(new ApiResponse(400, null, "Wrong user"))
    }

    if (order.orderStatus !== "delivered") return res.status(400).json(new ApiResponse(400, null, "Order incomplete"))

    const review = await Review.create({
        order: orderId,
        rating,
        feedback
    })
    if (!review) return res.status(500).json(new ApiResponse(500, null, "Unable to create review"))

    return res.status(201).json(new ApiResponse(201, review, "Review added"))
}

export {
    register,
    login,
    logout,
    updateCustomer,
    changePassword,
    getCurrentUser,
    addToCart,
    clearCart,
    addReview,
    getCart,
}