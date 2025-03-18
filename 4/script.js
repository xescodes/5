// DOM elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const statusIndicator = document.getElementById('statusIndicator');
const testServerBtn = document.getElementById('testServerBtn');

// API key (WARNING: In a real production app, never expose API keys in frontend code)
// This is only for demo purposes - in a real app, use a backend server
const OPENAI_API_KEY = "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";

// Test API connection on page load
window.addEventListener('DOMContentLoaded', () => {
    // Add initial message
    addMessage("Hello! I'm your AI assistant. Click the 'Test API Connection' button to start.", false);
});

// Event listeners
sendButton.addEventListener('click', sendMessage);
testServerBtn.addEventListener('click', testApiConnection);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Function to test API connection
async function testApiConnection() {
    updateStatus('testing');
    chatMessages.innerHTML = ''; // Clear previous messages
    addMessage("Testing API connection...", false);
    
    try {
        // Try using a CORS proxy to avoid direct API calls
        // Free CORS proxy for demo only - not suitable for production
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        
        // First, try direct connection
        try {
            const testResponse = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                }
            });
            
            if (testResponse.ok) {
                console.log('API connection successful (direct)');
                handleSuccessfulConnection();
                return;
            }
        } catch (directError) {
            console.error('Direct API connection failed:', directError);
            // Continue to proxy attempt
        }
        
        // If direct connection failed, try with a proxy
        const proxyResponse = await fetch(corsProxy + 'https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'X-Requested-With': 'XMLHttpRequest' // Required by CORS-anywhere
            }
        });
        
        if (proxyResponse.ok) {
            console.log('API connection successful (via proxy)');
            handleSuccessfulConnection();
        } else {
            const errorData = await proxyResponse.json();
            throw new Error(errorData.error?.message || 'API connection test failed');
        }
    } catch (error) {
        console.error('API connection error:', error);
        updateStatus('offline');
        
        // Provide different error message based on the error
        if (error.message.includes('cors') || error.message.includes('CORS')) {
            addMessage("Error: CORS policy is blocking API access. Try one of these solutions:\n1. Install a CORS browser extension\n2. Click 'Enable CORS' at https://cors-anywhere.herokuapp.com/ and retry", false);
        } else if (error.message.includes('API key')) {
            addMessage("Error: Invalid API key. Please check the API key in script.js", false);
        } else {
            addMessage(`Error: ${error.message || 'Cannot connect to OpenAI API. Check browser console for details'}`, false);
        }
        
        sendButton.disabled = true;
        testServerBtn.textContent = "Retry API Connection";
    }
}

function handleSuccessfulConnection() {
    updateStatus('online');
    addMessage('API connection successful! You can now send messages.', false);
    sendButton.disabled = false;
    testServerBtn.textContent = "Test API Connection";
}

// Update status indicator
function updateStatus(status) {
    // Remove all status classes
    statusIndicator.classList.remove('online', 'offline');
    
    if (status === 'online') {
        statusIndicator.classList.add('online');
        statusIndicator.title = 'API is online';
    } else if (status === 'offline') {
        statusIndicator.classList.add('offline');
        statusIndicator.title = 'API is offline';
    } else if (status === 'testing') {
        statusIndicator.classList.add('offline'); // Use offline style while testing
        statusIndicator.title = 'Testing API connection...';
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

// Function to send message to OpenAI API directly
async function sendToOpenAI(userMessage) {
    try {
        // Try direct API call first
        try {
            const directResponse = await callOpenAI(userMessage);
            return directResponse;
        } catch (directError) {
            console.error('Direct API call failed:', directError);
            
            // If direct call fails, try with proxy
            if (directError.message.includes('cors') || directError.message.includes('CORS')) {
                const corsProxy = 'https://cors-anywhere.herokuapp.com/';
                
                const proxyResponse = await fetch(corsProxy + 'https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'X-Requested-With': 'XMLHttpRequest' // Required by CORS-anywhere
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
                                content: userMessage
                            }
                        ],
                        max_tokens: 150
                    })
                });
                
                if (!proxyResponse.ok) {
                    const errorData = await proxyResponse.json();
                    throw new Error(errorData.error?.message || `HTTP error! Status: ${proxyResponse.status}`);
                }
                
                const data = await proxyResponse.json();
                return data.choices[0].message.content.trim();
            } else {
                // If it's not a CORS error, rethrow
                throw directError;
            }
        }
    } catch (error) {
        console.error('Error details:', error);
        
        if (error.message.includes('cors') || error.message.includes('CORS')) {
            return "Error: CORS policy is blocking API access. Try enabling a CORS browser extension or visiting https://cors-anywhere.herokuapp.com/ to request temporary access for the demo.";
        } else if (error.message.includes('API key')) {
            return "Error: Invalid API key. Please check the API key in script.js";
        } else {
            return `Error: ${error.message || 'An unknown error occurred'}`;
        }
    }
}

// Helper function for direct API calls
async function callOpenAI(userMessage) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
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
                    content: userMessage
                }
            ],
            max_tokens: 150
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
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
    
    // Get response from OpenAI
    const response = await sendToOpenAI(message);
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Add bot response to chat
    addMessage(response, false);
} 