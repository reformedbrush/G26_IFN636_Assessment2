
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const plotRoutes = require('./routes/plotRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();


const app = express();
const mongoose = require("mongoose");

mongoose.set('strictQuery', true); 

app.use(cors());
app.use(express.json());
app.use('/api/plots', plotRoutes);
app.use('/api/auth', authRoutes);

//app.use('/api/tasks', require('./routes/taskRoutes'));

// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app;