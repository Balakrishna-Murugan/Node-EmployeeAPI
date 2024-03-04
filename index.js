// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
//const path = require('path');
//const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5006;

// Middleware
//app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string
//const MONGODB_URI = 'mongodb+srv://RootUser:Root@cluster0.rvecbsg.mongodb.net/Cricket';
// Use environment variables for MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
// Connect to MongoDB
console.log(MONGODB_URI);
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Define Schema and Model for Employee
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
  name: String,
  age: Number,
  position: String,
});

const Employee = mongoose.model('Employee', employeeSchema);



// Serve your HTML file directly
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
  });

// Routes
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    //<h1>HI</h1>
    res.status(500).json({ message: err.message });
  }
});

app.post('/employees', async (req, res) => {
  const employee = new Employee(req.body);
  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
