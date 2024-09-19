import { Router } from "express";
import {
    registerVendor, login, logout, getCurrentUser, updateVendor, changePassword, changeShopImage, nearbyVendors
} from "../controllers/vendor.controller.js"
import verifyJWT from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([                
        {name: "shopImage", maxCount: 1},
        {name: "qrCodeImage", maxCount: 1}
    ]),
    registerVendor
)

router.post("/login", login)

router.get("/logout", verifyJWT("vendor"), logout)

router.get("/current", verifyJWT("vendor"), getCurrentUser)

router.patch("/update/details", verifyJWT("vendor"), updateVendor)

router.patch("/update/password", verifyJWT("vendor"), changePassword)

router.patch("/update/shopImage", verifyJWT("vendor"), upload.single("shopImage"), changeShopImage)

router.get("/nearby/:distance", verifyJWT("customer"), nearbyVendors)

export default router