import express from "express";
import connection from "../DB/db.mjs";
import path from "path";

import { fileURLToPath } from 'url';

import { v4 as uuidv4 } from 'uuid';

import { AdminModel } from "../Schema/Post.mjs";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const router = express.Router();
router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Admin/index.html"));
});
const dataSaver = [];
const uploadAdminDatabase = async () => {
    console.log("Data Uploading For Admin ...");
    const Id = uuidv4();
    console.log("Admin Id is assigned :", Id);
    const upload = await AdminModel.create({
        ID: Id,
        Name: dataSaver[0],
        OfficialEmail: dataSaver[1],
        PhoneNumber: dataSaver[2],
        Country: dataSaver[3]
    });
    await upload.save();
    console.log("Data Uploaded ...");
    dataSaver.splice(0, 5);
};
const Admin = async () => {
    await connection();
    await uploadAdminDatabase();
};
router.post("/", async (req, res) => {
    const { Name, OfficialEmail, PhoneNumber, Country } = req.body;
    if (Name && OfficialEmail && PhoneNumber && Country) {
        console.log(Name, OfficialEmail, PhoneNumber, Country);
        dataSaver.push(Name, OfficialEmail, PhoneNumber, Country);
        await Admin();
        res.send({ message: "Data Received" });
    } else {
        res.status(400).send({ message: "Data Not Received" });
    }
});

export default router;