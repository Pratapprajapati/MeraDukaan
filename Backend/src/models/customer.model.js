import mongoose, { Schema, model } from "mongoose";
import bycrypt from "bcrypt"
import jwt from "jsonwebtoken"

const customerSchema = new Schema({
    userType: {
        type: String,
        default: "customer"
    },
    userStatus: {
        type: String,
        default: "active",
        enum: ["active", "warned", "banned"]
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
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
        area: { type: String, required: true },
        address: { type: String, required: true },
        pincode: { type: Number, required: true },
    },
    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            vendor: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory',
                required: true
            },
            count: {
                type: Number,
                required: true,
                min: [1, 'Product count must be at least 1'],
                validate: {
                    validator: Number.isInteger,
                    message: '{VALUE} is not an integer value'
                }
            },
            _id: false  // Optionally set to false if you don't want mongoose to add an _id field to every cart item
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
            userType: this.userType,
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
            userType: this.userType,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
const Customer = model("Customer", customerSchema);
export default Customer;