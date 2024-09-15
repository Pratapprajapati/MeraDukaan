import { Router } from "express";
import {
    createInventory, addProduct, updateProduct, removeProduct, getInventory, inventoryOverview
} from "../controllers/inventory.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/", verifyJWT("vendor"), createInventory)

router.get("/vendor/:vendorId", verifyJWT("both"), getInventory)

router.post("/add", verifyJWT("vendor"), addProduct)

router.get("/overview", verifyJWT("vendor"), inventoryOverview)

router.route("/product/:productId", verifyJWT("vendor")).patch(updateProduct).delete(removeProduct)

export default router