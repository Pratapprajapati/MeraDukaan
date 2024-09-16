import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: "text"
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        default: "count",
        enum: ["count", "weight", "volume"]
    },
    addedBy: {
        type: mongoose.Types.ObjectId,
        ref: "Vendor"
    }
}, {
    timestamps: true
});

const Product = model("Product", productSchema);
export default Product;
