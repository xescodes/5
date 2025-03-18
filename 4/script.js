// DOM elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const statusIndicator = document.getElementById('statusIndicator');
const testServerBtn = document.getElementById('testServerBtn');

// Base URL for server
const SERVER_BASE_URL = 'http://localhost:3000';

// Test server connection on page load
window.addEventListener('DOMContentLoaded', testServerConnection);

// Event listeners
sendButton.addEventListener('click', sendMessage);
testServerBtn.addEventListener('click', testServerConnection);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Function to test server connection
async function testServerConnection() {
    updateStatus('testing');
    try {
        const response = await fetch(`${SERVER_BASE_URL}/api/test`);
        if (response.ok) {
            console.log('Server connection successful');
            updateStatus('online');
            // Only add the message if it's a manual test (button click)
            if (event && event.type === 'click') {
                addMessage('Server connection successful! You can now send messages.', false);
            }
            sendButton.disabled = false;
        } else {
            throw new Error('Server connection test failed');
        }
    } catch (error) {
        console.error('Server connection error:', error);
        updateStatus('offline');
        addMessage('Error: Cannot connect to the server. Please make sure the server is running with "npm start" on port 3000', false);
        sendButton.disabled = true;
    }
}

// Update status indicator
function updateStatus(status) {
    // Remove all status classes
    statusIndicator.classList.remove('online', 'offline');
    
    if (status === 'online') {
        statusIndicator.classList.add('online');
        statusIndicator.title = 'Server is online';
    } else if (status === 'offline') {
        statusIndicator.classList.add('offline');
        statusIndicator.title = 'Server is offline';
    } else if (status === 'testing') {
        statusIndicator.classList.add('offline'); // Use offline style while testing
        statusIndicator.title = 'Testing server connection...';
    }
}

// Function to add message to chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = text;
    
    messageDiv.appendChild(messageParagraph);
    chatMessages.appendChild(messageDiv);
    
    // Scroll to the bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typingIndicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        typingDiv.appendChild(dot);
    }
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Function to send message to our server API
async function sendToServer(userMessage) {
    try {
        // Use the full server URL with the base
        const serverUrl = `${SERVER_BASE_URL}/api/chat`;
        
        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error('Error details:', error);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return 'Error: Server connection failed. Make sure the server is running with "npm start" on port 3000';
        } else {
            return `Error: ${error.message}`;
        }
    }
}

// Function to send message
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addMessage(message, true);
    
    // Clear input
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get response from our server
    const response = await sendToServer(message);
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Add bot response to chat
    addMessage(response, false);
} 