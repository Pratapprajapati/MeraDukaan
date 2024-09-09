import { Router } from "express";
import {
    registerVendor, login, logout, getCurrentUser, updateVendor, changePassword, changeShopImage, changeQrCodeImage
} from "../controllers/vendor.controller.js"
import { verifyJWT_Vendor } from "../middlewares/auth.middleware.js";
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

router.get("/logout", verifyJWT_Vendor, logout)

router.get("/current", verifyJWT_Vendor, getCurrentUser)

router.patch("/update/details", verifyJWT_Vendor, updateVendor)

router.patch("/update/password", verifyJWT_Vendor, changePassword)

router.patch("/update/shopImage", verifyJWT_Vendor, upload.single("shopImage"), changeShopImage)

router.patch("/update/qrCode", verifyJWT_Vendor, upload.single("qrCodeImage"), changeQrCodeImage)

export default router