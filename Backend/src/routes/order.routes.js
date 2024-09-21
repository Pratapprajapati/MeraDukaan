import { Router } from "express";
import {
    placeOrder, manageOrder, getOrderHistory, getOrderById, getTodaysOrders, orderOverview
} from "../controllers/order.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/", verifyJWT("customer"), placeOrder)

router.get("/history/:duration", verifyJWT("both"), getOrderHistory)

router.get("/today:status", verifyJWT("vendor"), getTodaysOrders)

router.get("/view/:orderId", verifyJWT("both"), getOrderById)

router.patch("/manage/:orderId",verifyJWT("both"), manageOrder)

router.get("/overview/:duration",verifyJWT("vendor"), orderOverview)

export default router