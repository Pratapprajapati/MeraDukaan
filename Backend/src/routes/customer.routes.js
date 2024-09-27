import { Router } from "express";
import {
    register, login, logout, updateCustomer, changePassword, getCurrentUser, addToCart, removeFromCart, clearCart, getCart, getCartItemsByVendor, addReview
} from "../controllers/customer.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", register)

router.post("/login", login)

router.get("/logout", verifyJWT("customer"), logout);

router.patch("/update", verifyJWT("customer"), updateCustomer);

router.patch("/password", verifyJWT("customer"), changePassword);

router.get("/current", verifyJWT("customer"), getCurrentUser);

router.get("/cart", verifyJWT("customer"), getCart);

router.get("/cart/items/:vendor", verifyJWT("customer"), getCartItemsByVendor);

router.post("/cart/add", verifyJWT("customer"),addToCart);

router.post("/cart/remove", verifyJWT("customer"),removeFromCart);

router.delete("/cart/clear", verifyJWT("customer"), clearCart);

router.post("/review/:orderId", verifyJWT("customer"), addReview);

export default router