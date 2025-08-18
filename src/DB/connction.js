import mongoose from "mongoose";
export default function connectDB() {
        mongoose.connect(process.env.DB_URL).then(() => {
            console.log("Connected to MongoDB");
        }).catch((error) => {
            console.log(error);
        })
}
