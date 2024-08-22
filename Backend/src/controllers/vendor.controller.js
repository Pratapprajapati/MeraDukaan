import Vendor from "../models/vendor.model.js"; // Adjust the path as necessary
import ApiResponse from "../utils/ApiResponse.js"; // Adjust the path as necessary
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const registerVendor = async (req, res) => {

    const {
        username, email, password,
        shopName, registrationNumber, shopType, delivery,
        city, address, pincode,
        primary, secondary,
        start, end, shopOpen
    } = req.body;

    // Check if the email or username is already registered
    const existingVendor = await Vendor.findOne({ $or: [{ email }, { username }, { registrationNumber }] });
    if (existingVendor) {
        return res.status(400).json(new ApiResponse(400, null, "Vendor with this email, username, or registration number already exists."));
    }

    const shopImagePath = req.files?.shopImage[0]?.path
    if (!shopImagePath) return res.status(404).json(new ApiResponse(404, null, "Shop image path missing"))

    let qrCodeImagePath
    if (req.files?.qrCodeImage && Array.isArray(req.files?.qrCodeImage) && req.files.qrCodeImage.length > 0) qrCodeImagePath = req.files?.qrCodeImage[0]?.path

    const shopImageCloud = await uploadOnCloudinary(shopImagePath)
    const qrCodeImageCloud = await uploadOnCloudinary(qrCodeImagePath)

    if (!shopImageCloud) return res.status(404).json(new ApiResponse(404, null, "Shop image missing from cloudinary"))

    const vendor = await Vendor.create({
        username,
        email,
        password,
        shopName,
        shopType,
        delivery,
        shopOpen,
        registrationNumber,
        location: { city, address, pincode },
        contact: { primary, secondary },
        shopImage: shopImageCloud.secure_url,
        qrCodeImage: qrCodeImageCloud.secure_url,
        shopTimings: { start, end },
    });

    const vendorShop = await Vendor.findById(vendor._id).select(" -password ")

    return res.status(201).json(new ApiResponse(201, vendorShop, "Vendor registered successfully"));
};

const generateAccessAndRefreshTokens = async (vendorId) => {
    try {
        const vendor = await Vendor.findById(vendorId)

        const accessToken = vendor.generateAccessToken()
        const refreshToken = vendor.generateRefreshToken()

        vendor.refreshToken = refreshToken                // save the refreshToken in vendor's db
        await vendor.save({ validateBeforeSave: false })

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
    const user = await Vendor.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) return res.status(400).json(new ApiResponse(400, "Incorrect username or email"))

    // Check for password
    const validPassword = await user.isPasswordCorrect(password)
    if (!validPassword) return res.status(400).json(new ApiResponse(400, "Password incorrect"))

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // If everything checks out
    const vendor = await Vendor.findById(user?._id).select("-password -refreshToken")

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    vendor, accessToken, refreshToken
                },
                "Vendor logged in successfully!!"
            )
        )
}

// LOGOUT
const logout = async (req, res) => {
    await Vendor.findByIdAndUpdate(
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
const updateVendor = async (req, res) => {
    const {
        email,
        shopName, shopType, delivery,
        city, address, pincode,
        primary, secondary,
        start, end, shopOpen
    } = req.body;

    const curUser = req.user._id
    if (!curUser) return res.status(400).json(new ApiResponse(400, "No user"))

    const user = await Vendor.findById(req.user._id)

    if (email) user.email = email

    if (primary) user.contact.primary = primary
    if (secondary) user.contact.secondary = secondary

    if (address) user.location.address = address
    if (city) user.location.city = city
    if (pincode) user.location.pincode = pincode

    if (shopName) user.shopName = shopName
    if (shopType) user.shopType = shopType
    if (shopOpen) user.shopOpen = shopOpen
    if (delivery) user.delivery = delivery

    if (start) user.start = start
    if (end) user.end = end

    user.save({ validateBeforeSave: false })

    const vendor = await Vendor.findById(user?._id).select("-password -refreshToken")

    return res.status(201).json(new ApiResponse(201, vendor, "Vendor updated!"))
}

// CHANGE PASSWORD
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await Vendor.findById(req.user._id).select("password")

    const verify = await user.isPasswordCorrect(oldPassword)
    if (!verify) res.json(new ApiResponse(400, "", "Incorrect password"))

    user.password = newPassword
    user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, "", "Password changed."))
}

const changeShopImage = async (req, res) => {
    const shopImagePath = req.file?.path
    if (!shopImagePath) return res.status(404).json(new ApiResponse(404, null, "Shop image missing"))

    const shopImageCloud = await uploadOnCloudinary(shopImagePath)
    if (!shopImageCloud) return res.status(404).json(new ApiResponse(404, null, "Shop image not found"))

    const updatedDetail = await Vendor.findByIdAndUpdate(
        req.user?._id,
        { $set: { shopImage: shopImageCloud.secure_url } },
        { new: true }
    ).select("-password -refreshToken")

    await deleteFromCloudinary(req.user?.shopImage)
    console.log("Deleted old shop image")

    return res.status(200).json(new ApiResponse(200, updatedDetail, "Shop image changed"))
}

const changeQrCodeImage = async (req, res) => {
    const qrCodeImagePath = req.file?.path
    if (!qrCodeImagePath) return res.status(404).json(new ApiResponse(404, null, "qrCode image missing"))

    const qrCodeImageCloud = await uploadOnCloudinary(qrCodeImagePath)
    if (!qrCodeImageCloud) return res.status(404).json(new ApiResponse(404, null, "qrCode image not found"))

    const updatedDetail = await Vendor.findByIdAndUpdate(
        req.user?._id,
        { $set: { qrCodeImage: qrCodeImageCloud.secure_url } },
        { new: true }
    ).select("-password -refreshToken")

    const deleteOnCloud = await deleteFromCloudinary(req.user?.qrCodeImage)
    if (deleteOnCloud) console.log("Deleted old qrCode image")

    return res.status(200).json(new ApiResponse(200, updatedDetail, "qrCode image changed"))
}


// VENDOR DETAILS
const getCurrentUser = async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Details fetched"))
}
export {
    registerVendor,
    login,
    logout,
    updateVendor,
    changePassword,
    getCurrentUser,
    changeShopImage,
    changeQrCodeImage,
}
