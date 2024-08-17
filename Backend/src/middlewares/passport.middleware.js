import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import Customer from "../models/costumer.model.js";
import jwt from 'jsonwebtoken';
passport.use(
    new LocalStrategy(
        {
            usernameField: "username",  // Use "username" or "email" here. LocalStrategy takes only one field
            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                // Find user by username or email
                const user = await Customer.findOne({
                    $or: [{ username }, { email: username }], // username or email in one field
                });

                if (!user) {
                    return done(null, false, { message: "Incorrect username or email." });
                }

                // Check if password is correct
                const isPasswordValid = await user.isPasswordCorrect(password);
                if (!isPasswordValid) {
                    return done(null, false, { message: "Incorrect password." });
                }

                // Return user if authentication is successful
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Customer.findById(id).select("-password");
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Auth Middleware
export const authMiddleware = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: 'Unauthorized, token missing' });

    jwt.verify(token, 'your-secret-key', async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        const decodedUser = await Customer.findById(decoded.id).select("-password, -refreshToken")
        req.user = decodedUser
        next();
    });
};



export default passport;
