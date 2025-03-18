# OpenAI GPT Chatbot

A simple chatbot using HTML, CSS, and JavaScript that connects to the OpenAI GPT API.

## Setup Instructions

1. Clone or download this repository
2. Open `script.js` and replace `YOUR_OPENAI_API_KEY` with your actual OpenAI API key
3. Open `index.html` in your web browser

## Important Security Note

The current implementation keeps the API key in the client-side JavaScript code, which is NOT secure for production use. In a real application, you should:

1. Create a backend server to handle the API requests
2. Store your API key securely on the server
3. Send requests to your server, which will then forward them to the OpenAI API

## Features

- Simple, modern UI
- Real-time chat with OpenAI's GPT model
- Typing indicator
- Response scrolling

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenAI API

## License

MIT 