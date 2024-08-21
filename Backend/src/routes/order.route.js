import { Router } from "express";
import {
    placeOrder, manageOrder, getOrderHistory
} from "../controllers/order.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(placeOrder).get(getOrderHistory)

router.patch("/manage/:orderId", manageOrder)


export default router