import mongoose, { Schema, model } from "mongoose";

const inventorySchema = new Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    productList: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
            required: true
        },
        price: {
            type: Number,
        },
        stock: {
            type: Boolean,
            required: true,
            default: true
        },
        description: {
            type: String,
            default: ""
        },
        discount: {
            type: Number,
            default: 0
        },
    }]
}, {
    timestamps: true
});

const Inventory = model("Inventory", inventorySchema);
export default Inventory;
