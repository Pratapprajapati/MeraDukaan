import { Router } from "express";
import {
    placeOrder, manageOrder, getOrderHistory, getOrderById, getTodaysOrders
} from "../controllers/order.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/", verifyJWT("customer"), placeOrder)

router.get("/history/:duration", verifyJWT("vendor"), getOrderHistory)

router.get("/today", verifyJWT("vendor"), getTodaysOrders)

router.get("/:orderId", verifyJWT("both"), getOrderById)

router.patch("/manage/:orderId",verifyJWT("both"), manageOrder)


export default router