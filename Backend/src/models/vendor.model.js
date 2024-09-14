<<<<<<< HEAD
=======
import { Schema, model } from "mongoose";
import bycrypt from "bcrypt"
import jwt from "jsonwebtoken"

const vendorSchema = new Schema({
    userType: {
        type: String,
        default: "vendor"
    },
    username: {
        type : String,
        required : true,
        unique: true
    },
    email : {
        type : String,
        required : true,
    } ,
    password : {
        type : String,
        required : true
    },
    shopName: {
        type : String,
        required : true,
        index: true
    },
    registrationNumber: {
        type : String,
        required : true,
        unique: true
    },
    location: {
        city: { type: String, required: true },
        address: { type: String, required: true },
        pincode: { type: Number, required: true },
    },
    contact: {
        primary: { type: Number, required: true },
        secondary: { type: Number, required: false }  // Optional second contact
    },
    shopImage: {
        type : String,
        required : true
    },
    delivery: {
        type: Boolean,
        default: true
    },
    qrCodeImage: {
        type : String,
    },
    shopOpen: {
        type: String,
        required: true,
        default: "Everyday"
    },
    shopTimings: {
        start: {
            type : String,
            required : true
        },
        end: {
            type : String,
            required : true
        }
    },
    shopType: {
        type : String,
        required : true,
        default: "General",
        enum: ["General", "Grocery", "Stationary", "Pharmacy", "Electronics and Hardware", "Other"]
    },
    returnPol: {
        type: String,
        default: "Return"
    },
    verified: {
        type: String,
        default: "pending",
        enum: ["pending", "verified", "suspended"]
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

// Hashes the password before saving the document
vendorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()             // Checks if the password has been changed

    this.password = await bycrypt.hash(this.password, 10)     // encrypt password
    next()
})

// This method compares a given password with the hashed password stored in the database.
vendorSchema.methods.isPasswordCorrect = async function(password){
    return await bycrypt.compare(password, this.password)
}

// This method generates a JWT access token with user details.
vendorSchema.methods.generateAccessToken = function(){
    return jwt.sign(                                               //jwt.sign(payload or data, secretKey, options (Expiry))
        {
            _id: this._id,
            userType: this.userType,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// This method generates a JWT refresh token with minimal user data.
// used to obtain a new access token when the current one expires.
vendorSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const Vendor = model("Vendor",vendorSchema);
export default Vendor;
>>>>>>> 4ccb03a (FIxed database connectivity issue, added middlewares and added Customer, Vendor, Product and Order models)
