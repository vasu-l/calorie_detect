const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 4000;

// Configure multer for image upload
const upload = multer({ dest: "uploads/" });

app.post("/detect-food", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        console.log("Image uploaded:", req.file.path);

        // Read image file and convert to base64
        const imagePath = req.file.path;
        const imageBuffer = fs.readFileSync(imagePath);
        const imageBase64 = imageBuffer.toString("base64");

        console.log("Base64 Image Generated!");

        // Send request to OpenAI API
        console.log("Sending request to OpenAI...");
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",  // Change to "gpt-4" or "gpt-3.5-turbo"
                messages: [
                    {
                        role: "system",
                        content: "You are an AI assistant that identifies food items in images."
                    },
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "What food items are in this image?" },
                            { type: "image_url", image_url: `data:image/jpeg;base64,${imageBase64}` }
                        ]
                    }
                ],
                max_tokens: 100
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );
        

        console.log("OpenAI Response:", JSON.stringify(response.data, null, 2));

        res.json(response.data);
    } catch (error) {
        console.error("Error while calling OpenAI API:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to detect food items" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
