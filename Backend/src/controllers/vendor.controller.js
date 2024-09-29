import Vendor from "../models/vendor.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import CryptoJS from 'crypto-js'
import isShopOpen from "../utils/shopOpen.js";

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

        vendor.refreshToken = refreshToken
        vendor.isOpen = true
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

    const { start, end } = user.shopTimings;
    const shouldBeOpen = isShopOpen(start, end);
    console.log(shouldBeOpen)

    // If everything checks out
    const vendor = await Vendor.findByIdAndUpdate(
        user?._id,
        {$set: {isOpen: shouldBeOpen}},
        {new: true, select: (" _id userStatus userType isOpen shopName registrationNumber ")}
    )

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
        { $unset: { refreshToken: 1 }, $set: { isOpen: false } }
    )

    return res.status(200)
        .clearCookie("accessToken")     // clears tokens from cookies
        .clearCookie("refreshToken")
        .clearCookie("user")
        .json(new ApiResponse(200, {}, "User logged out successfully!!"))
}

// UPDATE USER
const updateVendor = async (req, res) => {
    const body = req.body;

    const curUser = req.user._id
    if (!curUser) return res.status(400).json(new ApiResponse(400, "No user"))

    const user = await Vendor.findById(req.user._id)

    if (body.email) user.email = body.email
    if (body["contact.primary"]) user.contact.primary = body["contact.primary"]
    if (body["contact.secondary"]) user.contact.secondary = body["contact.secondary"]

    if (body["location.address"]) user.location.address = body["location.address"]
    if (body["location.area"]) user.location.area = body["location.area"]
    if (body["location.city"]) user.location.city = body["location.city"]
    if (body["location.pincode"]) user.location.pincode = body["location.pincode"]
    if (body.returnPol) user.returnPol = body.returnPol

    if (body.shopName) user.shopName = body.shopName
    if (body.shopType) user.shopType = body.shopType
    if (body.shopOpen) user.shopOpen = body.shopOpen
    if (body.delivery) user.delivery = body.delivery

    if (body["shopTimings.start"]) user.shopTimings.start = body["shopTimings.start"]
    if (body["shopTimings.end"]) user.shopTimings.end = body["shopTimings.end"]

    user.save({ validateBeforeSave: false })

    const vendor = await Vendor.findById(user?._id).select("-password -refreshToken")

    return res.status(201).json(new ApiResponse(201, vendor, "Shop details updated!"))
}

// CHANGE PASSWORD
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body

    const user = await Vendor.findById(req.user._id).select("password")

    const verify = await user.isPasswordCorrect(oldPassword)
    if (!verify) return res.status(400).json(new ApiResponse(400, "", "Incorrect password"))

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, "", "Password changed."))
}

// CHANGE SHOP IMAGE
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

// TOGGLE SHOP OPEN/CLOSE
const toggleIsOpen = async (req, res) => {
    const {status} = req.body

    let open = req.user.isOpen

    if (status != null && open !== status) {
        const result = await Vendor.findByIdAndUpdate(
            req.user._id,
            {$set: {isOpen: status}},
            {new: true, select: "isOpen"}
        )

        open = result.isOpen
    }

    return res.status(200).json(new ApiResponse(200, open, "Shop open status fetched"))
}

// VENDORS NEAR YOU
const nearbyVendors = async (req, res) => {
    const { distance } = req.params
    const location = req.user.location

    let proximity = {}
    if (distance == "pincode") {
        const query = location.pincode
        proximity = { "location.pincode": query }
    }

    if (distance == "area") {
        function escapeRegex(input) {
            return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function buildRegexPattern(input) {
            const sanitizedInput = escapeRegex(input.trim().toLowerCase());
            // Replace common separators with a flexible pattern
            const flexiblePattern = sanitizedInput.replace(/[-\s]+/g, '[-\\s]*');
            // Add optional variations for directions
            const directionVariations = {
                'e': '(e(ast)?)?',
                'w': '(w(est)?)?',
                'n': '(n(orth)?)?',
                's': '(s(outh)?)?'
            };
            let patternWithDirections = flexiblePattern;
            Object.entries(directionVariations).forEach(([abbr, variation]) => {
                patternWithDirections = patternWithDirections.replace(
                    new RegExp(`\\b${abbr}\\b`, 'g'),
                    variation
                );
            });
            return `.*${patternWithDirections}.*`;
        }

        const query = location.area
        const regexPattern = buildRegexPattern(query);
        proximity = { "location.area": { $regex: regexPattern, $options: "i" } }
    }

    if (distance == "city") {
        const query = location.city
        proximity = { "location.city": { $regex: query, $options: "i" } }
    }

    const vendors = await Vendor.find(proximity).select(" shopName shopType isOpen location shopImage ")

    if (vendors.length === 0) return res.status(200).json(new ApiResponse(200, null, "No vendors found"));

    return res.status(200).json(new ApiResponse(200, vendors, "Vendors fetched"))
}

// SEARCH BY SHOP NAME
const searchVendor = async (req, res) => {
    const { searchTerm } = req.query

    const vendors = await Vendor.find({ "shopName": { $regex: searchTerm, $options: "i" } }).select(" shopName shopType isOpen location shopImage ")

    return res.status(200).json(new ApiResponse(200, vendors, "Vendors found"));
}

// VENDOR DETAILS
const getVendor = async (req, res) => {
    const { vendorId } = req.params

    const vendor = await Vendor.findById(vendorId)
    return res.status(200).json(new ApiResponse(200, vendor, "Details fetched"))
}

// PRODUCT BY VENDORS
const getVendorDetails = async (req, res) => {
    const { vendorsList } = req.body

    const vendors = await Vendor.find({ _id: { $in: vendorsList } })
        .select(" _id shopName location shopImage isOpen shopTimings"); // Only fetch necessary fields

    // Return the formatted response
    const vendorDetails = vendors.map(vendor => ({
        _id: vendor._id,
        shopName: vendor.shopName,
        shopImage: vendor.shopImage,
        location: vendor.location,
        isOpen: vendor.isOpen,
        shopTimings: vendor.shopTimings,
    }));

    return res.status(200).json(new ApiResponse(200, vendorDetails, "Details fetched"))
};


export {
    registerVendor,
    login,
    logout,
    updateVendor,
    changePassword,
    toggleIsOpen,
    getVendor,
    changeShopImage,
    nearbyVendors,
    searchVendor,
    getVendorDetails,
}
