import { Router } from "express";
import {
    register, updateCustomer
} from "../controllers/costumer.controller.js"
import passport, { authMiddleware } from "../middlewares/passport.middleware.js"
import jwt from 'jsonwebtoken';

const router = Router()

router.route("/register").post(register)

router.post('/login', async (req, res) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ message: 'Error during authentication' });
        if (!user) return res.status(401).json({ message: 'Authentication failed' });

        // Generate JWT
        const token = jwt.sign({ id: user._id, username: user.username }, 'your-secret-key', { expiresIn: '1d' });

        // Set token in cookie
        res.cookie('jwt', token, { httpOnly: true, secure: true});
        res.json({ message: 'Login successful', user });
    })(req, res);
});

router.post("/update", authMiddleware, updateCustomer);

export default router