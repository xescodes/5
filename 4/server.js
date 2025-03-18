const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Improved CORS configuration to allow requests from Live Server
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Route to handle OpenAI API requests
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        // Get API key from environment variable
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey || apiKey === 'your_openai_api_key_here') {
            return res.status(500).json({ 
                error: 'OpenAI API key not found or not set. Please set a valid OPENAI_API_KEY in the .env file.' 
            });
        }
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 150
            })
        });
        
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Expected JSON response but got ${contentType}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: data.error.message || 'OpenAI API Error' });
        }
        
        return res.json({ reply: data.choices[0].message.content.trim() });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Add a test route to check if server is running
app.get('/api/test', (req, res) => {
    res.json({ status: 'Server is running correctly' });
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoint available at http://localhost:${PORT}/api/chat`);
}); 