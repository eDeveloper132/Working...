import express from "express"
import connection from "../DB/db.mjs";
import path from "path";

import { fileURLToPath } from 'url';

import { v4 as uuidv4 } from 'uuid';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

import { UserModel} from "../Schema/Post.mjs";

const router = express.Router();
router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../User/index.html"));
});
const dataSaver = [];
const uploadUserDatabase = async () => {
    console.log("Data Uploading For User ...");
    const Id = uuidv4();
    console.log("User Id is assigned :", Id);
    const upload = await UserModel.create({
        ID: Id,
        Name: dataSaver[0],
        PhoneNumber: dataSaver[1],
        Email: dataSaver[2],
        Password: dataSaver[3],
        Role: dataSaver[4],
    });
    await upload.save();
    console.log("Data Uploaded ...");
    dataSaver.splice(0, 5);
};
const User = async () => {
    await connection();
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
export default router;