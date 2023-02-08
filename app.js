import express from "express";
import dotenv from "dotenv";
import { connectPassport } from "./utils/Provider.js";
import session from "express-session";
// import ConnectMongoDBSession from "connect-mongodb-session";
import passport from "passport";
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";


// const MongoDBSession = require("connect-mongodb-session")(session);
// const MongoDBSession = ConnectMongoDBSession(session);
// also can use this to store session in mongo db, what happens is db stores the session and sends the cookie back to client, we pass session as arguement

const app = express();
export default app;

dotenv.config({
    path: "./config/config.env",
});

// const store = new MongoDBSession({
//     uri: process.env.MONGO_URI,
//     collection: "mySessions",
// })

// using middlewares
// what app.use does is it initializes the session on every consecutive request and an object req.session is created by this.
app.use(session({
    // the cookie will be signed by this secret key
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // means even if no changes or modification occur, do we want to save again and again
    // store: store,
    cookie: {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: process.env.NODE_ENV === "development" ? false : true,
        sameSite: process.env.NODE_ENV === "development" ? false : "none",
    },
}));

app.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(passport.authenticate("session"));

// after creation of session
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));

connectPassport();


// importing Routes
import userRoute from "./routes/user.js";
import orderRoute from "./routes/order.js";

// import { session } from "passport";

app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);
app.use(errorMiddleware);