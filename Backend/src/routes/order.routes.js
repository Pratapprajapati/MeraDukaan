import { Router } from "express";
import {
    placeOrder, manageOrder, getOrderHistory
} from "../controllers/order.controller.js"
import { verifyJWT_Customer} from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/", verifyJWT_Customer, placeOrder)

router.get("/",getOrderHistory)

router.patch("/manage/:orderId", manageOrder)


export default router