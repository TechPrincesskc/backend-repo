//here we get the token from the cookie and verify it to check if the user is logged in or not and decode it

import jwt from "jsonwebtoken";
import {UserModel} from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies["auth-token"];

        if (!token) {
            return res.status(404).json({
                message: "no token found or token compromised"
            })
        }

        const decode = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await UserModel.findById(decodedToken.id)

        if(!user) {
            return res.status(401).json({
                message: `Not authenticated, please signup or login to access.`
            })
        }

        req.user = user
        next()  //always use this

    } catch (err) {
       if (err instanceof Error) {
         console.error(err);
         throw new Error(err);
       }
    }
}