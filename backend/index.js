// import { milkData, dailyData } from './config/database.js'
import express from "express";
import cors from "cors";

import router from "./routes/inventory.route.js";

const task = {
    _id: new Date().toISOString(),
    title: "Learn Java",
    description: "using some tutorial or ai",
    completed: false,
};

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", router);

app.listen(3001, () => {
    console.log("server is running on port: 3001");
});
