import mongoose from "mongoose";

function DB_Connection() {
    try {
        mongoose.connect(process.env.MONGO_URL).then(() => {
            console.log("Database connection success");
        });
        return;
    } catch (error) {
        console.log(error);
    }
}
export default DB_Connection;