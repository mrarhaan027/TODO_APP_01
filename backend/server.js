require("dotenv").config()
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const taskRoutes = require('./router');
const helmet=require("helmet")


const app = express();
// Example
// Connect Database
connectDB();

// Middleware
app.use(helmet())
app.use(cors());
app.use(express.json()); // Body parser for JSON


// Routes
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

