import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { configDotenv } from "dotenv";
configDotenv();

import DB_Connection from "./database/connection.js";
DB_Connection();

import route from "./routes/route.js";

const App = express();

// Middleware
App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(cookieParser());
App.use(
    cors({
        origin: "*",
        credentials: true,
    })
);

App.use("/", route);

App.listen(process.env.PORT, () => {
    console.log(`Express is running on port ${process.env.PORT}`);
});
