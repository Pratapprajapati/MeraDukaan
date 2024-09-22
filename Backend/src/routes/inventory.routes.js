import { Router } from "express";
import {
    createInventory, addMultipleProducts, updateProduct, removeProduct, getInventory, addProduct, inventoryOverview
} from "../controllers/inventory.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/", verifyJWT("vendor"), createInventory)

router.get("/vendor/:vendorId", verifyJWT("both"), getInventory)

router.post("/add", verifyJWT("vendor"), addProduct)

router.post("/multiple", verifyJWT("vendor"), addMultipleProducts)

router.get("/overview", verifyJWT("vendor"), inventoryOverview)

router.patch("/product/:productId", verifyJWT("vendor"), updateProduct)

router.delete("/product/:productId", verifyJWT("vendor"), removeProduct)

export default router