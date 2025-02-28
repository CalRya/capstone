const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/userRoutes');  // Import the user routes

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());  // Parse JSON bodies

// Use the user routes
app.use('/api/users', userRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
