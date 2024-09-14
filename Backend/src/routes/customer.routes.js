import { Router } from "express";
import {
    register, login, logout, updateCustomer, changePassword, getCurrentUser, addToCart, clearCart, getCart, addReview
} from "../controllers/customer.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", register)

router.get("/login", login)

router.get("/logout", verifyJWT, logout);

router.patch("/update", verifyJWT, updateCustomer);

router.patch("/password", verifyJWT, changePassword);

router.get("/current", verifyJWT, getCurrentUser);

router.get("/cart", verifyJWT, getCart);

router.post("/cart/add", verifyJWT,addToCart);

router.delete("/cart/clear", verifyJWT, clearCart);

router.post("/review/:orderId", verifyJWT, addReview);

export default router