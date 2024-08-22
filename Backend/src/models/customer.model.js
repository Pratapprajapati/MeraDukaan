import mongoose, { Schema, model } from "mongoose";
import bycrypt from "bcrypt"
import jwt from "jsonwebtoken"

const customerSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        primary: { type: Number, required: true },
        secondary: { type: Number, required: false }
    },
    location: {
        city: { type: String, required: true },
        address: { type: String, required: true },
        pincode: { type: Number, required: true },
    },
    cart: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            },
            count: {
                type: Number,
                default: 1
            },
            _id: false
        }
    ],
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

// Hashes the password before saving the document
customerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()             // Checks if the password has been changed

    this.password = await bycrypt.hash(this.password, 10)     // encrypt password
    next()
})

// This method compares a given password with the hashed password stored in the database.
customerSchema.methods.isPasswordCorrect = async function(password){
    return await bycrypt.compare(password, this.password)
}

// This method generates a JWT access token with user details.
customerSchema.methods.generateAccessToken = function(){
    return jwt.sign(                                               //jwt.sign(payload or data, secretKey, options (Expiry))
        {
            _id: this._id,
            email: this.email,
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
customerSchema.methods.generateRefreshToken = function(){
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
const Customer = model("Customer", customerSchema);
export default Customer;