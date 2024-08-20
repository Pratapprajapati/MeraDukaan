import { Router } from "express";
import {
    register, login, updateCustomer
} from "../controllers/customer.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(register)

router.route("/login").post(login)

router.post("/update", verifyJWT, updateCustomer);

export default router