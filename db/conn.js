import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.set("strictQuery", true);
    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`DB is connection with ${connection}`)
}
