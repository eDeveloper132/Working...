import express from "express"
import connection from "../DB/db.mjs";
import path from "path";

import { fileURLToPath } from 'url';

import { v4 as uuidv4 } from 'uuid';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import {  CompanyModel } from "../Schema/Post.mjs";

const router = express.Router();
router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Company/index.html"));
});
const dataSaver = [];
const uploadCompanyDatabase = async () => {
    console.log("Data Uploading For Company ...");
    const Id = uuidv4();
    console.log("Company Id is assigned :", Id);
    const upload = await CompanyModel.create({
        C_Id: Id,
        companyName: dataSaver[0],
        email: dataSaver[1],
        password: dataSaver[2],
        phone: dataSaver[3],
        Country: dataSaver[4]
    });
    await upload.save();
    console.log("Data Uploaded ...");
    dataSaver.splice(0, 5);
};
const Company = async () => {
    await connection();
    await uploadCompanyDatabase();
};

router.post("/", async (req, res) => {
    const { companyName, email, password, phone, Country } = req.body;
    if (companyName && email && password && phone && Country) {
        console.log(companyName, email, password, phone, Country);
        dataSaver.push(companyName, email, password, phone, Country);
        await Company();
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