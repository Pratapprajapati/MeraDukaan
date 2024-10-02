import dotenv from "dotenv"
import cors from "cors"
import express from "express"
import cookieParser from 'cookie-parser';
import connectDB from "./db.js";

dotenv.config({ path: "./env" })

const app = express()

// To handle middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"));
app.use(cookieParser())

// Database connection
connectDB()                         // promise is returned
.then(() => {
    app.on("error", (error) => console.log("ERROR: ", error))

    app.listen(process.env.PORT || 8080, () => {
        console.log("Listening on port no.", process.env.PORT);
    })
})
.catch((e) => console.log("Connection error: ", e))


// Routes
import customerRouter from "./routes/customer.routes.js"
import productRouter from "./routes/product.routes.js"
import inventoryRouter from "./routes/inventory.routes.js"
import orderRouter from "./routes/order.routes.js"
import vendorRouter from "./routes/vendor.routes.js"

app.use("/api/customer", customerRouter)
app.use("/api/product", productRouter)
app.use("/api/inventory", inventoryRouter)
app.use("/api/order", orderRouter)
app.use("/api/vendor", vendorRouter)