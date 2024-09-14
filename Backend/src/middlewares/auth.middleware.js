import Customer from "../models/customer.model.js";
import Vendor from "../models/vendor.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const verifyJWT = (pass) => async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const type =  decodedToken.userType
        let user = {}
        
        // Checking if route access is for customer, vendor or both
        if (!([type, "both"].includes(pass))) return res.status(401).json(new ApiResponse(401, null, "Not Allowed"));
        
        if (type === "customer") {
            user = await Customer.findById(decodedToken._id).select("-password -refreshToken");
            if (!user) return res.status(401).json(new ApiResponse(401, null, "Could not find customer"));
        }
        else if (type === "vendor"){
            user = await Vendor.findById(decodedToken._id).select("-password -refreshToken");
            if (!user) return res.status(401).json(new ApiResponse(401, null, "Could not find vendor"));
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json(new ApiResponse(401, null, error?.message || "Invalid Access Token"));
    }
};

export default verifyJWT