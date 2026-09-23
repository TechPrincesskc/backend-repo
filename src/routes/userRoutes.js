//an address book


import {Router} from "express";
import { getHome, getAbout, postUser, login} from "../controllers/usercontrollers.js";

const router = Router();

router.get("/home", getHome).get("/about", getAbout).post("/signup", postUser).post("/login", login)
    
export default router;
