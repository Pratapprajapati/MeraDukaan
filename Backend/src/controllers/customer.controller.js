import Customer from "../models/customer.model.js"
import ApiResponse from "../utils/ApiResponse.js"

const register = async (req, res) => {

    const { username, email, password, primary, secondary, address, city, pincode } = req.body

    const existingUser = await Customer.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) return res.status(400).json(new ApiResponse(400, "User with email or username already exists"))

    const user = await Customer.create({
        username,
        email,
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
    if (!username && !email) new ApiResponse(400, "Username or Email is required!!")

    // Search for user
    const user = await Customer.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) return res.status(400).json(new ApiResponse(400, "Incorrect username or email"))

    // Check for password
    const validPassword = await user.isPasswordCorrect(password)
    if (!validPassword) return res.status(400).json(new ApiResponse(400, "Password incorrect"))

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // If everything checks out
    const customer = await Customer.findById(user?._id).select("-password -refreshToken")

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
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
const logout = async (res, req) => {
    await Customer.findByIdAndUpdate(
        req.user?._id,
        { $unset: { refreshToken: 1 } }
    )

    return res.status(200)
        .clearCookie("accessToken")     // clears tokens from cookies
        .clearCookie("refreshToken")
        .clearCookie("user")
        .json(new ApiResponse(200, {}, "User logged out successfully!!"))
}

// UPDATE USER
const updateCustomer = async (req, res) => {
    const { username, email, password, primary, secondary, address, city, pincode } = req.body

    const curUser = req.user._id
    if (!curUser) return res.status(400).json(new ApiResponse(400, "No user"))

    const user = await Customer.findById(req.user._id)

    if (username) user.username = username
    if (email) user.email = email
    if (primary) user.contact.primary = primary
    if (secondary) user.contact.secondary = secondary
    if (address) user.location.address = address
    if (city) user.location.city = city
    if (pincode) user.location.pincode = pincode
    user.save({ validateBeforeSave: false })

    const customer = await Customer.findById(user?._id).select("-password")

    return res.status(201).json(new ApiResponse(201, customer, "Customer created!"))
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
    return res.status(200).json(new ApiResponse(200, req.user, "Details fetched"))
}

// ADD TO CART
const addToCart = async (req, res) => {
    const { productId, count } = req.body;
    if (count < 1) return res.status(401).json(new ApiResponse(401, null, "Product count must be atleast 1"))

    // Find the customer
    const customer = await Customer.findById(req.user._id);
    if (!customer) return res.status(404).json(new ApiResponse(404, null, "Customer not found"));

    // Check if the product is already in the cart
    const cartItem = customer.cart.find(item => item.product == (productId));

    if (cartItem) {
        cartItem.count = count
    } else {
        // If product is not in the cart and count is positive, add it to the cart
        customer.cart.push({ product: productId, count });
    }

    // Save the updated cart
    await customer.save();

    return res.status(200).json(new ApiResponse(200, customer.cart, "Cart updated successfully"));
}

const clearCart = async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(
        req.user._id,
        { $set: { cart: [] } },
        { new: true }
    ).select("cart")

    return res.status(200).json(new ApiResponse(200, customer, "Cleared cart"))
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
}