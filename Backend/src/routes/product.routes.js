import { Router } from "express";
import {
    addProduct, removeProduct, updateProduct, searchProduct, allProducts, specificProducts, getSampleProductsFromEachCategory
} from "../controllers/product.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.post("/add", upload.single("image"), verifyJWT("vendor"), addProduct)

router.route("/:productId", verifyJWT("vendor")).delete(removeProduct).patch(updateProduct)

router.get("/search", verifyJWT("both"), searchProduct)

router.get("/all", verifyJWT("both"), allProducts)

router.get("/specific/:subCategory/:page", verifyJWT("both"), specificProducts)

router.get("/sample", verifyJWT("both"), getSampleProductsFromEachCategory)

export default router