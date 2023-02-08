import express from "express";
import passport from "passport";
import { getAdminOrders, getMyOrders, getOrderDetails, paymentVerification, placeOrder, placeOrderOnline, processOrder } from "../controllers/order.js";
import { myProfile, logout } from "../controllers/user.js";
import { authorizeAdmin, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/createorder", isAuthenticated, placeOrder);

router.post("/createorderonline", isAuthenticated, placeOrderOnline);

router.post("/paymentverification", isAuthenticated, paymentVerification);

router.get("/myorders", isAuthenticated, getMyOrders);

router.get('/order/:id', isAuthenticated, getOrderDetails);


// Add admin middleware
router.get('/admin/orders', authorizeAdmin, isAuthenticated, getAdminOrders);

router.get('/admin/order/:id', authorizeAdmin, isAuthenticated, processOrder);



export default router;