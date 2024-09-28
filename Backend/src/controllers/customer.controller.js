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

    const customer = await Customer.findById(user?._id).select(" _id userType userStatus")

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
        customer.cart[cartItemIndex].count = count;
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


//REMOVE FROM CART
const removeFromCart = async (req, res) => {
    const { product, vendor } = req.body
    console.log(req.body)

    const customer = await Customer.findById(req.user._id).select(" cart ")

    if (!customer) return res.status(404).json(new ApiResponse(404, null, "Customer not found"));

    const itemIndex = customer.cart.findIndex(
        (item) =>
            item.product.toString() === product &&
            item.vendor.toString() === vendor
    );
    if (itemIndex === -1) return res.status(404).json(new ApiResponse(404, null, "Item not found in cart"));

    customer.cart.splice(itemIndex, 1); // Remove 1 item at the found index

    await customer.save();

    return res.status(200).json(new ApiResponse(200, null, "Item removed from cart successfully"));
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

// GET CART WITH PRODUCT, VENDOR AND INVENTORY DETAILS
const getCart = async (req, res) => {
    try {
        // Aggregate customer cart with product, vendor, and inventory details
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
                    from: "vendors",
                    localField: "cart.vendor", // vendorId stored in the cart
                    foreignField: "_id",
                    as: "vendorDetails"
                }
            },
            {
                $unwind: "$vendorDetails" // Unwind vendor details since lookup returns an array
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
                // Filter out cart items where inventoryDetails is null (i.e., product not found in inventory)
                $match: {
                    inventoryDetails: { $ne: null }
                }
            },
            {
                $project: {
                    _id: 0,
                    "cart.product": {
                        _id: "$productDetails._id",
                        name: "$productDetails.name",
                        price: "$productDetails.price",
                    },
                    "cart.inventoryDetails": {
                        price: "$inventoryDetails.productDetails.price",
                        stock: "$inventoryDetails.productDetails.stock",
                        description: "$inventoryDetails.productDetails.description",
                        discount: "$inventoryDetails.productDetails.discount"
                    },
                    "cart.vendor": {
                        _id: "$vendorDetails._id",
                        shopName: "$vendorDetails.shopName",
                        isOpen: "$vendorDetails.isOpen",
                        location: "$vendorDetails.location",
                        shopTimings: "$vendorDetails.shopTimings"
                    },
                    "cart.count": "$cart.count", // Keep the count as it is
                }
            }
        ]);

        // If no cart found, return an error
        if (!customerCart.length) {
            return res.status(404).json(new ApiResponse(404, null, "Cart not found"));
        }

        // Group cart items by vendorId and filter out products not found in inventory
        let cartByVendor = {};
        customerCart.forEach(item => {
            const vendorId = item.cart.vendor._id.toString();
            if (!cartByVendor[vendorId]) {
                cartByVendor[vendorId] = {
                    vendorInfo: {
                        shopName: item.cart.vendor.shopName,
                        isOpen: item.cart.vendor.isOpen,
                        location: item.cart.vendor.location,
                        shopTimings: item.cart.vendor.shopTimings
                    },
                    products: []
                };
            }
            cartByVendor[vendorId].products.push({
                product: item.cart.product,
                count: item.cart.count,
                price: item.cart.inventoryDetails.price, // Use inventory price
                stock: item.cart.inventoryDetails.stock,
                description: item.cart.inventoryDetails.description,
                discount: item.cart.inventoryDetails.discount
            });
        });

        // If no products are left in the cart after filtering, return an empty cart
        if (!Object.keys(cartByVendor).length) {
            return res.status(404).json(new ApiResponse(404, null, "No products found in inventory"));
        }

        // Return the cart grouped by vendors
        return res.status(200).json(new ApiResponse(200, cartByVendor, "Cart fetched successfully"));
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch cart"));
    }
};

// SPECIFIC VENDOR'S CART
const vendorCart = async (req, res) => {
    try {
        const { vendorId } = req.params; // Get vendorId from the request parameters
        const user = req.user;

        // Aggregate customer's cart for the specific vendor with product and inventory details
        const customerCart = await Customer.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.user._id) } // Match the customer by ID
            },
            {
                $unwind: "$cart" // Unwind the cart array to work on each cart item separately
            },
            {
                $match: { "cart.vendor": new mongoose.Types.ObjectId(vendorId) } // Filter cart items for the specific vendor
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
                    from: "vendors",
                    localField: "cart.vendor", // vendorId stored in the cart
                    foreignField: "_id",
                    as: "vendorDetails"
                }
            },
            {
                $unwind: "$vendorDetails" // Unwind vendor details since lookup returns an array
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
                // Match only items that exist in both the inventory and the product collection
                $match: { "inventoryDetails.productDetails": { $exists: true } }
            },
            {
                $project: {
                    _id: 1,
                    "cart.product": {
                        _id: "$productDetails._id",
                        name: "$productDetails.name",
                        image: "$productDetails.image",
                        subCategory: "$productDetails.subCategory",
                        price: "$productDetails.price", // Product price (fallback)
                    },
                    "cart.inventoryDetails": {
                        price: {
                            $ifNull: ["$inventoryDetails.productDetails.price", "$productDetails.price"] // Use inventory price, or fallback to product price
                        },
                        stock: "$inventoryDetails.productDetails.stock",
                        description: "$inventoryDetails.productDetails.description",
                        discount: "$inventoryDetails.productDetails.discount"
                    },
                    "cart.vendor": {
                        _id: "$vendorDetails._id",
                        shopName: "$vendorDetails.shopName",
                        isOpen: "$vendorDetails.isOpen",
                        location: "$vendorDetails.location",
                        delivery: "$vendorDetails.delivery",
                        shopTimings: "$vendorDetails.shopTimings"
                    },
                    "cart.count": "$cart.count", // Keep the count as it is
                }
            }
        ]);

        // If no cart found for the vendor, return an error
        if (!customerCart.length) {
            return res.status(404).json(new ApiResponse(404, null, "Cart not found for this vendor"));
        }

        // Group the products by the vendor (since there's only one vendor, no need to group by vendorId)
        let vendorCart = {
            customerInfo: {
                address: user.location.address + ", " + user.location.area,
                contact: user.contact.primary,
            },
            vendorInfo: {
                _id: customerCart[0].cart.vendor._id,
                shopName: customerCart[0].cart.vendor.shopName,
                isOpen: customerCart[0].cart.vendor.isOpen,
                location: customerCart[0].cart.vendor.location,
                delivery: customerCart[0].cart.vendor.delivery,
                shopTimings: customerCart[0].cart.vendor.shopTimings
            },
            products: customerCart.map(item => ({
                product: item.cart.product,
                count: item.cart.count,
                price: item.cart.inventoryDetails ? item.cart.inventoryDetails.price : item.cart.product.price, // Fallback to product price
                stock: item.cart.inventoryDetails ? item.cart.inventoryDetails.stock : null,
                description: item.cart.inventoryDetails ? item.cart.inventoryDetails.description : null,
                discount: item.cart.inventoryDetails ? item.cart.inventoryDetails.discount : null
            }))
        };

        // Return the cart for the specific vendor
        return res.status(200).json(new ApiResponse(200, vendorCart, "Vendor cart fetched successfully"));
    } catch (error) {
        console.error("Error fetching vendor cart:", error);
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch vendor cart"));
    }
};


// CART ITEMS OF SPECIFIC VENDOR (ONLY IDs)
const getCartItemsByVendor = async (req, res) => {
    const { vendor } = req.params
    const cart = req.user.cart

    const vendorCart = cart.filter(item =>
        item.vendor.toString() === vendor
    );

    if (!vendorCart) {
        return res.status(404).json(new ApiResponse(404, null, "No cart items found for this vendor"));
    }

    return res.status(200).json(new ApiResponse(200, vendorCart, "Cart items fetched"));
};


// REMOVE CART ITEMS OF SPECIFIC VENDOR
const deleteCartItemsByVendor = async (req, res) => {
    const { vendor } = req.params;
    const cart = req.user.cart;

    const updatedCart = cart.filter(item => item.vendor.toString() !== vendor);

    if (cart.length === updatedCart.length) return res.status(404).json(new ApiResponse(404, null, "No cart items found for this vendor"));

    req.user.cart = updatedCart;
    await req.user.save();

    return res.status(200).json(new ApiResponse(200, updatedCart, "Cart items deleted successfully"));
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
    removeFromCart,
    clearCart,
    addReview,
    getCart,
    vendorCart,
    getCartItemsByVendor,
    deleteCartItemsByVendor,
}