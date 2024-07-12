import express from "express";
import connection from "../DB/db.mjs";
import path from "path";
import "dotenv/config";
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { CallModel } from "../Schema/Post.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const datasender = [];
const Bland_res = [];
const url = 'https://api.bland.ai/v1/calls'; // Replace with actual Blend.ai API endpoint
const apiKey = process.env.apikey;

const sendDataToBlendAi = async (dataToSend) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${apiKey}` // Include API key as Authorization header
            },
            body: JSON.stringify(dataToSend) // Convert data to JSON string
        });
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        
        const responseData = await response.json(); // Parse response JSON
        console.log('Response from Blend.ai:', responseData);
        Bland_res.push(responseData.call_id, responseData.status, responseData.message);
        return responseData;
    } catch (error) {
        console.error('Error sending data to Blend.ai:', error);
        throw error; // Handle or propagate the error as needed
    }
};

const sender = async () => {
    const dataToSend = {
        phone_number: `${datasender[0]}`,
        task: `${datasender[1]}`
    };
    
    try {
        const response = await sendDataToBlendAi(dataToSend);
        console.log('Data sent successfully:', response);
    } catch (error) {
        console.error('Failed to send data to Blend.ai:', error);
    }
    
    datasender.splice(0, 2);
};

router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Call/index.html"));
});
router.post('/showCallDetail', (req, res) => {
    const { callId } = req.body; // Assuming callId is sent in the request body as JSON

    // Process the callId as needed (e.g., save to database, fetch related data)
    console.log(callId);

    // Example response
    res.status(200).send('Received callId successfully');
});
const dataSaver = [];
router.get("/showCall", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Call/show.html"));
});
router.get("/showCallDetail", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../Call/Detail.html"));
});


const uploadCallDatabase = async () => {
    console.log("Data Uploading For Call ...");
    console.log("Caller Id is assigned :", Bland_res[0]);

    const upload = new CallModel({
        Caller_Id: Bland_res[0],
        Status: Bland_res[1],
        Message: Bland_res[2],
        to: dataSaver[0],
        from: Bland_res[6],
        Description: dataSaver[1],
        call_length: Bland_res[3],
        batch_id: Bland_res[5],
        price: Bland_res[4],
        call_ended_by: Bland_res[7],
        started_at: Bland_res[9],
        end_at: Bland_res[8],
        country: Bland_res[10],
        timezone: Bland_res[11],
        concatenated_transcript: Bland_res[12],
    });
    
    await upload.save();
    console.log("Data Uploaded ...");
    dataSaver.splice(0, 2);
    Bland_res.splice(0, 13);
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
        dataSaver.push(mix, additionalinfo);
        datasender.push(mix, additionalinfo);
        await sender();
        await Call();
        res.send({ message: "Data Received" });
    } else {
        res.status(400).send({ message: "Data Not Received" });
    }
});

export default router;
