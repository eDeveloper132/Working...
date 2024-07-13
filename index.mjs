import express from "express";
import "dotenv/config";
import cors from "cors";
import { fileURLToPath } from 'url';
import adminRoute from "./Routes/Admin.mjs";
import userRoute from "./Routes/User.mjs";
import callRoute from "./Routes/Call.mjs";
import path from "path";
import companyRoute from "./Routes/Company.mjs";
import connection from "./DB/db.mjs";

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(cors());

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server listening
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Serve static index.html
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./Public/index.html"));
});

// Database connection
await connection();

// Routes
app.use("/Admin/", adminRoute);
app.use("/User/", userRoute);
app.use("/Call/", callRoute);
app.use("/Company/", companyRoute);

// External API endpoint and options
const url = 'https://api.bland.ai/v1/calls'; // Replace with actual Blend.ai API endpoint
const apiKey = process.env.apikey;
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `${apiKey}`
    }
};

// Fetch data from external API
async function fetchData() {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const callIds = data.calls.map(call => call.c_id);
        
        return {data , callIds};
    } catch (err) {
        console.error('Fetch error:', err);
        return null;
    }
}

// Route to fetch data
app.get("/fetchData", async (req, res) => {
    const callIds = await fetchData();
    res.json(callIds);
});

// Data receiver array for POST /fetchDetail endpoint
const dataReceiver = [];

// Receive callId and store in dataReceiver
app.post('/fetchDetail', (req, res) => {
    const { callId } = req.body;
    dataReceiver.push(callId);
    // console.log(callId);
    res.status(200).send('Received callId successfully');
});

// Options for fetching detail from external API
const fetchDetailOptions = {
    method: 'GET',
    headers: {
        'authorization': `${apiKey}`
    }
};

// Fetch detail from external API
const fetchDetail = async()=> {
    try {
        const response = await fetch(`https://api.bland.ai/v1/calls/`+dataReceiver[0], fetchDetailOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const Customize = { callId: data.call_id ,
            callLength: data.call_length ,
            callTo: data.to , 
            callFrom: data.from ,
            createdAt: data.created_at ,
            Inbound: data.inbound , 
            callSummary: data.summary , 
            callTranscript: data.concatenated_transcript ,
            callStatus: data.status ,
            callVariables: data.variables ,
            callRecordingUrl: data.recording_url ,
            callRecord: data.record ,
            callPrice : data.price}
        return Customize;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// Route to fetch detail
app.get("/fetchDetail", async (req, res) => {
    const callDetail = await fetchDetail();
    dataReceiver.splice(0, 1);
    res.json(callDetail);
});

// Default route for 404
app.use("*", (req, res) => {
    res.status(404).send({ message: "You are in the wrong place" });
});
