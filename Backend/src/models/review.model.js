import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    order: {
        type: mongoose.Types.ObjectId,
        ref: "Order"
    },
    rating: {
        type: Number,
        required: true
    },
    feedback: {
        type: String
    }
})

const Review = model("Review", reviewSchema)
export default Review