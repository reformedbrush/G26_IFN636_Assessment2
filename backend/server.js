
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const plotRoutes = require('./routes/plotRoutes');
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();


const app = express();
const mongoose = require("mongoose");

mongoose.set('strictQuery', true); 

app.use(cors());
app.use(express.json());
app.use('/api/plots', plotRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/events', eventRoutes);


if (require.main === module) {
    connectDB();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app;
