import Customer from "../models/customer.model.js";
import Vendor from "../models/vendor.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
export const verifyJWT_Customer = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await Customer.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) return res.status(401).json(new ApiResponse(401, null, "Could not find customer"));

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json(new ApiResponse(401, null, error?.message || "Invalid Access Token"));
    }
};

export const verifyJWT_Vendor = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await Vendor.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) return res.status(401).json(new ApiResponse(401, null, "Could not find vendor"));

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json(new ApiResponse(401, null, error?.message || "Invalid Access Token"));
    }
};
