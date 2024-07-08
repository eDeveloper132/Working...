import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from "../Schema/Post.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../User/index.html"));
});

const dataSaver = [];

const uploadUserDatabase = async () => {
    console.log("Data Uploading For User ...");
    const Id = uuidv4();
    console.log("User Id is assigned :", Id);
    try {
        const upload = await UserModel.create({
            ID: Id,
            Name: dataSaver[0],
            PhoneNumber: dataSaver[2],
            Email: dataSaver[1],
            Password: dataSaver[3],
            Role: dataSaver[4],
        });
        console.log("Data Uploaded ...");
        dataSaver.splice(0, 5);
    } catch (error) {
        console.error("Error uploading user data:", error);
        // Handle error appropriately, e.g., logging, sending response
    }
};

const User = async () => {
    await uploadUserDatabase();
};

router.post("/", async (req, res) => {
    const { Name, Email, PhoneNumber, Password, Role } = req.body;
    if (Name && Email && PhoneNumber && Password && Role) {
        console.log(Name, Email, PhoneNumber, Password, Role);
        dataSaver.push(Name, Email, PhoneNumber, Password, Role);
        await User();
        res.send({ message: "Data Received" });
    } else {
        res.status(400).send({ message: "Data Not Received" });
    }
});

router.get("/login/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../User/login.html"));
});

router.post("/login/", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const user = await UserModel.findOne({ Email: email, Password: password });
        if (user) {
            res.send({ message: "Login Successfully", user });
        } else {
            res.send({ message: "Login Failed" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send({ message: "Error during login" });
    }
});

export default router;
