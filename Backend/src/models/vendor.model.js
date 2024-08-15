<<<<<<< HEAD
=======
import { Schema, model } from "mongoose";

const vendorSchema = new Schema({
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
    shopTimings: {
        start: {
            type : String,
            required : true
        },
        to: {
            type : String,
            required : true
        }
    },
    shopType: {
        type : String,
        required : true,
        default: "General",
        enum: ["General", "Grocery", "Stationary", "Pharmacy", "Electronics and Hardware", "Other"]
    }
}, {
    timestamps: true
});

// Hashes the password before saving the document
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()             // Checks if the password has been changed

    this.password = await bycrypt.hash(this.password, 10)     // encrypt password
    next()
})

// This method compares a given password with the hashed password stored in the database.
userSchema.methods.isPasswordCorrect = async function(password){
    return await bycrypt.compare(password, this.password)
}

const Vendor = model("Vendor",vendorSchema);
export default Vendor;
>>>>>>> 4ccb03a (FIxed database connectivity issue, added middlewares and added Customer, Vendor, Product and Order models)
