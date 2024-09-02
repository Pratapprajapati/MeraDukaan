import { Router } from "express";
import {
    addProduct, removeProduct, updateProduct
} from "../controllers/product.controller.js"
import { verifyJWT_Vendor } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.use(verifyJWT_Vendor)

router.post("/add", upload.single("image"), addProduct)

router.route("/:productId").delete(removeProduct).patch(updateProduct)

export default router