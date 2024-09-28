import Customer from "../models/customer.model.js";
import Vendor from "../models/vendor.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const clearAuthCookies = (res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('user');
};

const refreshAccessToken = async (req, res) => {
    if (!req.cookies) {
        throw new Error("No cookies found in the request");
    }

    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        clearAuthCookies(res);
        throw new Error("Refresh token not provided");
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        let user;
        if (decoded.userType === "vendor") {
            user = await Vendor.findById(decoded._id);
        } else {
            user = await Customer.findById(decoded._id);
        }

        if (!user || user.refreshToken !== refreshToken) {
            clearAuthCookies(res);
            throw new Error("Invalid refresh token");
        }

        // Generate a new access token
        const accessToken = user.generateAccessToken();
        
        // Update the cookie with the new access token
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true });
        
        return accessToken;
    } catch (error) {
        clearAuthCookies(res);
        throw new Error("Invalid or expired refresh token");
    }
};

const verifyJWT = (pass) => async (req, res, next) => {
    try {
        if (!req.cookies) {
            clearAuthCookies(res);
            return res.status(400).json(new ApiResponse(400, null, "No cookies found in the request"));
        }

        // Get token from cookies or Authorization header
        let token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            clearAuthCookies(res);
            return res.status(401).json(new ApiResponse(401, null, "Unauthorized: No token provided"));
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                try {
                    token = await refreshAccessToken(req, res);
                    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
                } catch (refreshError) {
                    clearAuthCookies(res);
                    return res.status(403).json(new ApiResponse(403, null, refreshError.message));
                }
            } else {
                clearAuthCookies(res);
                throw error; 
            }
        }

        const type = decodedToken.userType;

        if (!([type, "both"].includes(pass))) {
            clearAuthCookies(res);
            return res.status(403).json(new ApiResponse(403, null, "Forbidden: Access not allowed"));
        }

        // Fetch user based on the type
        let user;
        if (type === "customer") {
            user = await Customer.findById(decodedToken._id).select("-password -refreshToken");
            if (!user) {
                clearAuthCookies(res);
                return res.status(404).json(new ApiResponse(404, null, "Customer not found"));
            }
        } else if (type === "vendor") {
            user = await Vendor.findById(decodedToken._id).select("-password -refreshToken");
            if (!user) {
                clearAuthCookies(res);
                return res.status(404).json(new ApiResponse(404, null, "Vendor not found"));
            }
        }

        // Attach the user to the request object
        req.user = user;
        next();

    } catch (error) {
        clearAuthCookies(res);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json(new ApiResponse(401, null, "Invalid token, please log in again"));
        }
        // Fallback for other errors
        return res.status(401).json(new ApiResponse(401, null, "Unauthorized access"));
    }
};

export default verifyJWT;