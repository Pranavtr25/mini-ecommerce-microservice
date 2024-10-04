const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const connectDB=require("./config/dbConnect")
const cors = require('cors');

const app = express();
app.use(cors())

connectDB();
app.use(express.json());

app.use('/users', userRoutes);

app.listen(3000, () => {
  console.log('User Service running on port 3000');
});