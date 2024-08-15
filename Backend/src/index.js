<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
import dotenv from "dotenv"
import cors from "cors"
>>>>>>> 4ccb03a (FIxed database connectivity issue, added middlewares and added Customer, Vendor, Product and Order models)
import { connect } from "mongoose";
import express from "express"
// import cookieparser from "cookieparser"

import Customer from "./models/costumer.model.js";


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
// app.use(cookieparser())

// Database connection
(async () => {
    try {
        const con = await connect(`${process.env.MONGO_URL}/mera-dukaan`)
        console.log("Database connected on: ", con.connection.host);

        app.listen(8080, () => {
            console.log("Listening to app on port 8080 :)");
        });
    } catch (error) {
        console.log("Database connection error: ", error);
        process.exit(1)
    }
})()

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Routes
app.post("/testCustomer", async(req,res) =>{
    let sampleCustomer = await Customer.create({
        username : "hercules12",
        email : "hercules12@gmail.com",
        password : "123asdc",
    });

    console.log(sampleCustomer);
    let customer = await Customer.findById(sampleCustomer._id)
    if(!customer) res.status(404).send("Not found")    
    res.status(200).send(customer);
})
>>>>>>> 4ccb03a (FIxed database connectivity issue, added middlewares and added Customer, Vendor, Product and Order models)
