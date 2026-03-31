require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_KEY;

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: messages,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        res.json({ answer: data.choices[0].message.content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ answer: "Error connecting to AI." });
    }
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
