import { Router } from "express";
import {
    addProduct, removeProduct, updateProduct, getInventory
} from "../controllers/product.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.post("/add", addProduct)

router.route("/:productId").delete(removeProduct).patch(updateProduct)

router.get("/vendor/:vendorId", getInventory)

export default router