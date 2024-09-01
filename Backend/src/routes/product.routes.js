import { Router } from "express";
import {
    addProduct, removeProduct, updateProduct
} from "../controllers/product.controller.js"
import { verifyJWT_Vendor } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT_Vendor)

router.post("/add", addProduct)

router.route("/:productId").delete(removeProduct).patch(updateProduct)

export default router