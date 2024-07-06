import express from "express";
import "dotenv/config";
import cors from "cors";
import { fileURLToPath } from 'url';
import adminRoute from "./Routes/Admin.mjs"
import userRoute from "./Routes/User.mjs"
import callRoute from "./Routes/Call.mjs"
import path from "path";
import companyRoute from "./Routes/Company.mjs"

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./Public/index.html"));
});

app.use("/Admin/",adminRoute);
app.use("/User/",userRoute);
app.use("/Call/",callRoute);
app.use("/Company/",companyRoute);

app.use("*", (req, res) => {
    res.status(404).send({ message: "You are in the wrong place" });
});