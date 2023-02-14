import { asyncError } from "../middleware/errorMiddleware.js";
import { Order } from "../modals/Order.js";
import { Payment } from "../modals/Payment.js";
import ErroHandler from "../utils/ErrorHandling.js";
// import { instance } from "../server.js";
import crypto from "crypto";

export const placeOrder = asyncError(async (req, res, next) => {
    const user = req.user._id;
    const {
        shippingInfo, orderItems, paymentMethod, paymentInfo, paidAt, itemsPrice, shippingCharges, taxCharges, totalAmount, orderStatus, deliveredAt
    } = req.body;


    const orderOptions = {
        shippingInfo, orderItems, user, paymentMethod, paymentInfo, paidAt, itemsPrice, shippingCharges, taxCharges, totalAmount, orderStatus, deliveredAt,
    };

    await Order.create(orderOptions);

    res.status(201).json({
        success: true,
        message: "Order Placed Successfully Via COD",
    });
});

// export const placeOrderOnline = asyncError(async (req, res, next) => {
//     const {
//         shippingInfo, orderItems, user, paymentMethod, paymentInfo, paidAt, itemsPrice, shippingCharges, taxCharges, totalAmount, orderStatus, deliveredAt
//     } = req.body;

//     const orderOptions = {
//         shippingInfo, orderItems, user, paymentMethod, paymentInfo, paidAt, itemsPrice, shippingCharges, taxCharges, totalAmount, orderStatus, deliveredAt,
//     };

//     const options = {
//         amount: Number(totalAmount * 100),  // amount in the smallest currency unit
//         currency: "INR",
//         receipt: "order_rcptid_11"
//     };

//     const order = await instance.orders.create(options);

//     res.status(201).json({
//         success: true,
//         options,
//         orderOptions,
//     });
// });

// export const paymentVerification = asyncError(async (req, res, next) => {
//     const { razorpay_payment_id, razorpay_order_id,
//         razorpay_signature,
//         orderOptions } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(body.toString())
//         .digest('hex');

//     const isAuthentic = razorpay_signature === expectedSignature;

//     if (!isAuthentic) {
//         return next(new ErroHandler("Paymnt Failed", 400));
//     }
//     const payment = await Payment.create({ razorpay_order_id, razorpay_payment_id, razorpay_signature });

//     await Order.create({
//         ...orderOptions, paidAt: new Date(Date.now()), paymentInfo: payment._id,
//     });
// });

export const getMyOrders = (asyncError(async (req, res, next) => {
    const orders = await Order.find({
        user: req.user._id,
    }).populate("user", "name");
    res.status(200).json({
        success: true,
        orders,
    })
}));

export const getOrderDetails = (asyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErroHandler("Invlaid Order id", 404));
    }
    res.status(200).json({
        success: true,
        order,
    })
}));

export const getAdminOrders = (asyncError(async (req, res, next) => {
    const orders = await Order.find({
        user: req.user._id,
    }).populate("user", "name");
    res.status(200).json({
        success: true,
        orders,
    })
}));

export const processOrder = (asyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErroHandler("Invlaid Order id", 404));
    }

    if (order.orderStatus === "Preparing") {
        order.orderStatus = "Shipped";
    } else if (order.orderStatus === "Shipped") {
        order.orderStatus = "Delivered";
        order.deliveredAt = new Date(Date.now());
    } else if (order.orderStatus === "Delivered") {
        return next(new ErroHandler("Food Already Delivered", 400));
    }

    await order.save();

    res.status(200).json({
        success: true,
        message: "Status Updated Successfully",
    });
}));