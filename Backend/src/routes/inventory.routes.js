import { Router } from "express";
import {
    addMultipleProducts, updateProduct, removeProduct, inventoryProds, getInventory, addProduct, inventoryOverview
} from "../controllers/inventory.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.get("/vendor/:vendorId", verifyJWT("both"), getInventory)

router.post("/add", verifyJWT("vendor"), addProduct)

router.post("/multiple", verifyJWT("vendor"), addMultipleProducts)

router.get("/products", verifyJWT("vendor"), inventoryProds)

router.get("/overview", verifyJWT("vendor"), inventoryOverview)

router.patch("/product/:productId", verifyJWT("vendor"), updateProduct)

router.delete("/product/:productId", verifyJWT("vendor"), removeProduct)

export default router