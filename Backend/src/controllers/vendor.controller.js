import Vendor from "../models/vendor.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import CryptoJS from 'crypto-js'

const registerVendor = async (req, res) => {

    const {
        username, email, password,
        shopName, registrationNumber, shopType, delivery, returnPol,
        city, area, address, pincode,
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
        returnPol,
        registrationNumber,
        location: { city, address: address + " @ " + area, pincode },
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

const options = { httpOnly: true, secure: true }

// LOGIN
const login = async (req, res) => {
    const { username, email, password } = req.body
    if (!username && !email) new ApiResponse(400, null, "Username or Email is required!!")

    const user = await Vendor.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) return res.status(400).json(new ApiResponse(400, null, "Incorrect username or email"))

    const validPassword = await user.isPasswordCorrect(password)
    if (!validPassword) return res.status(400).json(new ApiResponse(400, null, "Password incorrect"))

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // If everything checks out
    const vendor = await Vendor.findById(user?._id).select("-password -refreshToken")

    const vendorData = CryptoJS.AES.encrypt(JSON.stringify(vendor), "secretKey").toString()

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .cookie("user", vendorData)
        .json(
            new ApiResponse(200, vendor, "Vendor logged in successfully!!")
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
        email, returnPol,
        shopName, shopType, delivery,
        city, address, pincode, area,
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
    if (area) user.location.area = area
    if (pincode) user.location.pincode = pincode
    if (returnPol) user.location.returnPol = returnPol

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

const nearbyVendors = async (req, res) => {
    const { distance } = req.params
    const location = req.user.location

    let vendors = []
    if (distance == "pincode") {
        const query = location.pincode
        vendors = await Vendor.find({ "location.pincode": query }).select(" shopName shopType isOpen location ")
    }

    if (distance == "area") {
        function escapeRegex(input) {
            return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters for regex
        }

        function buildRegexPattern(input) {
            const sanitizedInput = escapeRegex(input.trim()); // Remove leading/trailing spaces and escape special characters
            return sanitizedInput.replace(/\s+/g, '.*'); // Replace spaces with '.*' to allow for flexible matching
        }

        const query = location.area
        const regexPattern = buildRegexPattern(query);
        vendors = await Vendor.find({ "location.area": { $regex: regexPattern, $options: "i" } }).select(" shopName shopType isOpen location ")
    }

    if (distance == "city") {
        const query = location.city
        vendors = await Vendor.find({ "location.city": query }).select(" shopName shopType isOpen location ")
    }

    if (vendors.length === 0) return res.status(200).json(new ApiResponse(200, null, "No vendors found"));

    return res.status(200).json(new ApiResponse(200, vendors, "Vendors fetched"))
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
    nearbyVendors,
}
