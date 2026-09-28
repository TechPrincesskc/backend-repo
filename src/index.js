
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/index.js";
import mongoose from "mongoose";
//connect to database (.env file)
import dotenv from "dotenv";  //dependencies that helps us extract env variable
dotenv.config();


const app = express();
const PORT = 3000;

// Connect to MongoDB

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("Database connected")).catch((err) => console.error(err));

await connectDB(process.env.MONGODB_URI).then(() => console.log("Database connected"))


app.use(express.json());
app.use(cookieParser());
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on active port ${PORT}`);
});