import { Router } from "express";
import {
    register, login, logout, updateCustomer, changePassword, getCurrentUser, addToCart, clearCart
} from "../controllers/customer.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", register)

router.get("/login", login)

router.get("/logout", verifyJWT, logout);

router.patch("/update", verifyJWT, updateCustomer);

router.patch("/password", verifyJWT, changePassword);

router.get("/current", verifyJWT, getCurrentUser);

router.post("/cart/add", verifyJWT,addToCart);

router.post("/cart/clear", verifyJWT, clearCart);

export default router