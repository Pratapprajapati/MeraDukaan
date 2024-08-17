import Customer from "../models/costumer.model.js"
import ApiResponse from "../utils/ApiResponse.js"

const register = async (req, res) => {
    
    const { username, email, password, primary, secondary, address, city, pincode} = req.body

    const existingUser = await Customer.findOne({
        $or: [{ username }, { email }]
    })
    if (existingUser) return res.status(400).json( new ApiResponse(400, "User with email or username already exists"))

    const user = await Customer.create({
        username,
        email,
        password,
        contact: {primary, secondary},
        location: {address, city, pincode}
    })
    if (!user) return res.status(500).json( new ApiResponse(500, "Something went wrong!"))

    const customer = await Customer.findById(user?._id).select("-password")

    return res.status(201).json( new ApiResponse(201, customer, "Customer created!"))
}

const login = async (req, res) => {
    const {username, email, password} = req.body
    if (!username && !email) new ApiResponse(400, "Username or Email is required!!")

    const user = await Customer.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) return res.status(400).json( new ApiResponse(400, "Incorrect username or email"))

    const validPassword = await user.isPasswordCorrect(password)
    if (!validPassword) return res.status(400).json( new ApiResponse(400,"Password incorrect"))

    const customer = await Customer.findById(user?._id).select("-password")

    return res.status(200).json( new ApiResponse(200, customer, "Login successful!!"))
}

const updateCustomer = async (req, res) => {
    
    const { username, email, password, primary, secondary, address, city, pincode} = req.body

    const curUser = req.user._id    
    if (!curUser) return res.status(400).json( new ApiResponse(400, "No user"))

    const user = await Customer.findById(req.user._id)

    if (username) user.username = username
    if (email) user.email = email
    if (primary) user.contact.primary = primary
    if (secondary) user.contact.secondary = secondary
    if (address) user.location.address = address
    if (city) user.location.city = city
    if (pincode) user.location.pincode = pincode
    user.save({validateBeforeSave: false})
    
    const customer = await Customer.findById(user?._id).select("-password")

    return res.status(201).json( new ApiResponse(201, customer, "Customer created!"))
}

export {
    register,
    updateCustomer
}