import { Router } from "express";
import {
    createInventory, addProduct, updateProduct, removeProduct, getInventory
} from "../controllers/inventory.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/", verifyJWT("vendor"), createInventory)

router.get("/:vendorId", verifyJWT("both"), getInventory)

router.post("/add", verifyJWT("vendor"), addProduct)

router.route("/product/:productId", verifyJWT("vendor")).patch(updateProduct).delete(removeProduct)

export default router