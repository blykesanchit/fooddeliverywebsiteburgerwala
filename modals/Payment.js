import mongoose, { mongo } from "mongoose";

const schema = new mongoose.Schema({
    razerpay_order_id: {
        type: String,
        required: true,
    },
    razor_payment_id: {
        type: String,
        required: true,
    },
    razorpay_signature: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const Payment = mongoose.model("Payment", schema);