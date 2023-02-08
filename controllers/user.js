import { asyncError } from "../middleware/errorMiddleware.js";
import { Order } from "../modals/Order.js";
import { User } from "../modals/User.js";

export const myProfile = ((req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});

export const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie("connect.sid", {
            secure: process.env.NODE_ENV === "development" ? false : true,
            httpOnly: process.env.NODE_ENV === "development" ? false : true,
            sameSite: process.env.NODE_ENV === "development" ? false : "none",
        });
        res.status(200).json({
            message: "Logged out",
        });
    });
};

export const getAdminUsers = asyncError(async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
        success: true,
        users,
    })
});

export const getAdminStats = asyncError(async (req, res, next) => {
    const usersCount = await User.countDocuments();

    const orders = await Order.find({});

    const preparingOrders = orders.filter(i => {
        return i.orderStatus === "Preparing";
    })
    const shippedOrders = orders.filter(i => {
        return i.orderStatus === "Shipped";
    })
    const deliveredOrders = orders.filter(i => {
        return i.orderStatus === "Delivered";
    })

    let totalIncome = 0;
    orders.forEach(i => {
        totalIncome += i.totalAmount;
    });

    res.status(201).json({
        success: true,
        usersCount,
        orderCount: {
            total: orders.lenght,
            preparing: preparingOrders.lenght,
            shipped: shippedOrders.lenght,
            delivered: deliveredOrders.lenght
        },
        totalIncome,
    });

})