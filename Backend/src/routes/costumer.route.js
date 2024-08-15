import { Router } from "express";
import {
    register, login
} from "../controllers/costumer.controller.js"

const router = Router()

router.route("/register").post(register)

router.route("/login").get(login)

export default router