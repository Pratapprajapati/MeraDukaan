import { Router } from "express";
import {
    addProduct, removeProduct
} from "../controllers/product.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.post("/add", addProduct)

router.delete("/remove/:productId", removeProduct)


export default router