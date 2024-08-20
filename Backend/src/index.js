<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
import dotenv from "dotenv"
import cors from "cors"
import express from "express"
import cookieParser from 'cookie-parser';
import connectDB from "./db.js";

dotenv.config({ path: "./env" })

<<<<<<< HEAD
}
>>>>>>> 0382384 (Test if works)
=======
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
import customerRouter from "./routes/customer.route.js"

<<<<<<< HEAD
    console.log(sampleCustomer);
    let customer = await Customer.findById(sampleCustomer._id)
    if(!customer) res.status(404).send("Not found")    
    res.status(200).send(customer);
})
>>>>>>> 4ccb03a (FIxed database connectivity issue, added middlewares and added Customer, Vendor, Product and Order models)
=======
app.use("/api/customer", customerRouter)
>>>>>>> fe896f9 (Added Register and login controllers and routes. Added bycrypt and fixed bugs. Added ApiResponse)
