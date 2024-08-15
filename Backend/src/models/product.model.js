import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    vendor: {
        type: mongoose.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Boolean,
        required: true,
        default: true
    },
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const Product = model("Product", productSchema);
export default Product;
