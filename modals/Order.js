import mongoose from "mongoose";

const schema = new mongoose.Schema({
    shippingInfo: {
        hNo: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
        },
    },
    orderItems: {
        cheeseBurger: {
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        },
        vegCheeseBurger: {
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        },
        burgerWithFries: {
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        },
    },
    user: {
        type: mongoose.Schema.ObjectId,
        // means whenever the objectid is searched it will search from the user model we created
        ref: "User",
        required: true,
    },

    paymentMethod: {
        type: "String",
        enum: ["COD", "Online"],
        default: "COD",
    },

    paymentInfo: {
        type: mongoose.Schema.ObjectId,
        ref: "Payment",
    },

    paidAt: Date,

    itemsPrice: {
        type: Number,
        default: 0,
    }, taxCharges: {
        type: Number,
        default: 0,
    }, shippingCharges: {
        type: Number,
        default: 0,
    }, totalAmount: {
        type: Number,
        default: 0,
    },

    orderStatus: {
        type: String,
        enum: ["Preparing", "Shipped", "Delivered"],
        default: "Preparing"
    },

    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Order = mongoose.model("Order", schema);