import app from './app.js';
import { conectDB } from "../server/db/conn.js";
import Razorpay from "razorpay";

conectDB();

export var instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_API_SECRET });

app.get("/", (req, res, next) => {
    res.send("Hey");
});

app.get("/about", (req, res, next) => {
    res.send("About Page");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}/api/v1/ in ${process.env.NODE_ENV} mode`);
});