import { Router } from "express";
import {
    createInventory, addProduct, updateProduct, removeProduct, getInventory
} from "../controllers/inventory.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/").post(createInventory).get(getInventory)
router.route("/:vendorId").get(getInventory)

router.post("/add", addProduct)

router.route("/:productId").patch(updateProduct).delete(removeProduct)

export default router