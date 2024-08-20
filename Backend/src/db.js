import { connect } from "mongoose";

const connectDB = async () => {             //async functions returns a promise
    try {
        const con = await connect(`${process.env.MONGO_URL}/mera-dukaan`)

        console.log("MONGODB connected!! DB HOST: ", con.connection.host);  // Connection host details

    } catch (error) {
        console.log("MONGODB connection error:", error);
        process.exit(1)                                         // terminate the process
    }
}

export default connectDB