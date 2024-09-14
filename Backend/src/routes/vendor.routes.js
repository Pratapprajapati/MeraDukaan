import { Router } from "express";
import {
    registerVendor, login, logout, getCurrentUser, updateVendor, changePassword, changeShopImage, changeQrCodeImage
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

router.get("/logout", verifyJWT, logout)

router.get("/current", verifyJWT, getCurrentUser)

router.patch("/update/details", verifyJWT, updateVendor)

router.patch("/update/password", verifyJWT, changePassword)

router.patch("/update/shopImage", verifyJWT, upload.single("shopImage"), changeShopImage)

router.patch("/update/qrCode", verifyJWT, upload.single("qrCodeImage"), changeQrCodeImage)

export default router