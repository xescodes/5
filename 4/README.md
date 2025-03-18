# OpenAI GPT Chatbot

A simple chatbot using HTML, CSS, and JavaScript that connects to the OpenAI GPT API via a Node.js server.

## Setup Instructions

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Start the server:
   ```
   npm start
   ```
5. Open your browser and go to `http://localhost:3000`

## Features

- Simple, modern UI
- Real-time chat with OpenAI's GPT model
- Typing indicator
- Response scrolling
- Secure API key handling via backend server

## Development

For development with auto-restart on file changes:
```
npm run dev
```

## Technologies Used

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Node.js, Express
- API: OpenAI GPT API
- Environment variables: dotenv

## License

MIT 