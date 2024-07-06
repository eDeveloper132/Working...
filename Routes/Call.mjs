import express from "express"
import connection from "../DB/db.mjs";
import path from "path";

import { fileURLToPath } from 'url';

import { v4 as uuidv4 } from 'uuid';

import { CallModel } from "../Schema/Post.mjs";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Call/index.html"));
});
const dataSaver = [];
const uploadCallDatabase = async () => {
    console.log("Data Uploading For Call ...");
    const Id = uuidv4();
    console.log("Caller Id is assigned :", Id);
    const upload = await CallModel.create({
        Caller_Id: Id,
        PhoneCode: dataSaver[0],
        PhoneNumber: dataSaver[1],
        Description: dataSaver[2]
    });
    await upload.save();
    console.log("Data Uploaded ...");
    dataSaver.splice(0, 5);
};
const Call = async () => {
    await connection();
    await uploadCallDatabase();
};

router.post("/", async (req, res) => {
    const { phonecode, phonenumber, additionalinfo } = req.body;
    console.log(req.body);
    if (phonecode && phonenumber && additionalinfo) {
        dataSaver(phonecode, phonenumber, additionalinfo);
        await Call();
        res.send({ message: "Data Received" });
    } else {
        res.status(400).send({ message: "Data Not Received" });
    }
});
export default router;