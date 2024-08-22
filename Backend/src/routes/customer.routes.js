import { Router } from "express";
import {
    register, login, logout, updateCustomer, changePassword, getCurrentUser, addToCart, clearCart, addReview
} from "../controllers/customer.controller.js"
import { verifyJWT_Customer } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", register)

router.get("/login", login)

router.get("/logout", verifyJWT_Customer, logout);

router.patch("/update", verifyJWT_Customer, updateCustomer);

router.patch("/password", verifyJWT_Customer, changePassword);

router.get("/current", verifyJWT_Customer, getCurrentUser);

router.post("/cart/add", verifyJWT_Customer,addToCart);

router.delete("/cart/clear", verifyJWT_Customer, clearCart);

router.post("/review/:orderId", verifyJWT_Customer, addReview);

export default router