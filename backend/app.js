const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');


const app = express();
app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'));

app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
