const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Ensure users.json exists
const usersFilePath = path.join(dataDir, 'users.json');
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify({ users: [] }), 'utf8');
}

// Read users data
const getUsersData = () => {
  const data = fs.readFileSync(usersFilePath, 'utf8');
  return JSON.parse(data);
};

// Write users data
const saveUsersData = (data) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Routes
// GET all users
app.get('/api/users', (req, res) => {
  const data = getUsersData();
  res.json(data.users);
});

// GET user by ID
app.get('/api/users/:id', (req, res) => {
  const data = getUsersData();
  const user = data.users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json(user);
});

// POST create user
app.post('/api/users', (req, res) => {
  const { name, email, age } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }
  
  const data = getUsersData();
  
  // Generate ID (simple implementation)
  const newId = data.users.length > 0 
    ? Math.max(...data.users.map(u => u.id)) + 1 
    : 1;
  
  const newUser = {
    id: newId,
    name,
    email,
    age: age || null,
    createdAt: new Date().toISOString()
  };
  
  data.users.push(newUser);
  saveUsersData(data);
  
  res.status(201).json(newUser);
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const { name, email, age } = req.body;
  const userId = parseInt(req.params.id);
  
  const data = getUsersData();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const updatedUser = {
    ...data.users[userIndex],
    name: name || data.users[userIndex].name,
    email: email || data.users[userIndex].email,
    age: age !== undefined ? age : data.users[userIndex].age,
    updatedAt: new Date().toISOString()
  };
  
  data.users[userIndex] = updatedUser;
  saveUsersData(data);
  
  res.json(updatedUser);
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  
  const data = getUsersData();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  data.users.splice(userIndex, 1);
  saveUsersData(data);
  
  res.json({ message: 'User deleted successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 