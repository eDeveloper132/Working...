import express from "express"
import connection from "../DB/db.mjs";
import path from "path";
import "dotenv/config"

import { fileURLToPath } from 'url';

import { v4 as uuidv4 } from 'uuid';

import { CallModel } from "../Schema/Post.mjs";
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const router = express.Router();
const datasender = []
const Bland_res = []
const sendDataToBlendAi = async (dataToSend) => {
    try {
        const url = 'https://api.bland.ai/v1/calls'; // Replace with actual Blend.ai API endpoint
        const apiKey = process.env.apikey; // Replace with your Blend.ai API key
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${apiKey}` // Include API key as Authorization header
            },
            body: JSON.stringify(dataToSend) // Convert data to JSON string
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const responseData = await response.json(); // Parse response JSON
        console.log('Response from Blend.ai:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error sending data to Blend.ai:', error);
        throw error; // Handle or propagate the error as needed
    }
};

const sender = async () =>
{


    const dataToSend = {
        // Construct your data object here according to Blend.ai API requirements
        phone_number: `${datasender[0]}`,
        task: `${datasender[1]}`
        // Add more fields as needed
    };
    sendDataToBlendAi(dataToSend)
    .then(response => {
        // Handle response from Blend.ai
        console.log('Data sent successfully:', response);
        Bland_res.push(response.call_id , response.status , response.message)
    })
    .catch(error => {
        // Handle error
        console.error('Failed to send data to Blend.ai:', error);
    });
    datasender.splice(0,2);
}



router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Call/index.html"));
});
const dataSaver = [];
const uploadCallDatabase = async () => {
    console.log("Data Uploading For Call ...");
    // const Id = uuidv4();
    console.log("Caller Id is assigned :", Bland_res[0]);
    const upload = await CallModel.create({
        Caller_Id: Bland_res[0],
        Status: Bland_res[1],
        Message: Bland_res[2],
        Phone_Number: dataSaver[0],
        Description: dataSaver[1]
    });
    await upload.save();
    console.log("Data Uploaded ...");
    dataSaver.splice(0, 2);
    Bland_res.splice(0, 3);
};
const Call = async () => {
    await connection();
    await uploadCallDatabase();
};

router.post("/", async (req, res) => {
    const { phonecode, phonenumber, additionalinfo } = req.body;
    console.log(req.body);
    if (phonecode && phonenumber && additionalinfo) {
        const mix = phonecode + phonenumber;
        dataSaver.push(mix , additionalinfo);
        datasender.push(mix , additionalinfo)
        await sender();
        await Call();
        res.send({ message: "Data Received" });
    } else {
        res.status(400).send({ message: "Data Not Received" });
    }
});
export default router;