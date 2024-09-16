import { Router } from "express";
import {
    addProduct, removeProduct, updateProduct, searchProduct, allProducts
} from "../controllers/product.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.use(verifyJWT("both"))

router.post("/add", upload.single("image"), addProduct)

router.route("/:productId").delete(removeProduct).patch(updateProduct)

router.route("/search").get(searchProduct)

router.route("/all").get(allProducts)

export default router