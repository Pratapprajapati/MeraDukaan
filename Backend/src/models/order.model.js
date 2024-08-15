import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    vendor: {
        type: mongoose.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    orderItems: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
                required: true
            },
            count: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            }
        }
    ],
    bill: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus: {
        type: String,
        enum: ["pending", "shipped", "delivered", "canceled"],
        default: "pending"
    },
    paymentMethod: {
        type: String,
        enum: ["card", "cash", "online"],
        default: "cash"
    },
    paymentImg: {
        type: String
    }
}, {
    timestamps: true
});

// Pre-save middleware to calculate total for each item and the total bill amount
orderSchema.pre("save", function(next) {
    this.orderItems.forEach(item => {
        item.total = item.count * item.price;  // Calculate total for each item
    });

    this.bill = this.orderItems.reduce((acc, item) => acc + item.total, 0); // Calculate total bill
    next();
});

const Order = model("Order", orderSchema);
export default Order;
