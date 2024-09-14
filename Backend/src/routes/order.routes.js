import { Router } from "express";
import {
    placeOrder, manageOrder, getOrderHistory, getOrderById, getTodaysOrders
} from "../controllers/order.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()
router.use(verifyJWT)

router.post("/", placeOrder)

router.get("/history/:duration", getOrderHistory)

router.get("/today", getTodaysOrders)

router.get("/:orderId", getOrderById)

router.patch("/manage/:orderId", manageOrder)


export default router