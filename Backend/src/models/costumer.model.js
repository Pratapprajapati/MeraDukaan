<<<<<<< HEAD
<<<<<<< HEAD
=======
import { Schema , model } from "mongoose";
=======
import mongoose, { Schema, model } from "mongoose";
>>>>>>> 4ccb03a (FIxed database connectivity issue, added middlewares and added Customer, Vendor, Product and Order models)


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
    orderHistory: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Order"
        }
    ],
    cart: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            },
            count: {
                type: Number,
                default: 1
            }
        }
    ]
}, {
    timestamps: true
});

<<<<<<< HEAD
const Customer = model("Customer",customerSchema);
export default Customer;
>>>>>>> 0382384 (Test if works)
=======
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

const Customer = model("Customer", customerSchema);
export default Customer;
>>>>>>> 4ccb03a (FIxed database connectivity issue, added middlewares and added Customer, Vendor, Product and Order models)
