const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
<<<<<<< HEAD


const app = express();
=======
const cors = require('cors'); 

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}));

>>>>>>> 4e96b110194b9d3d7743cc41d0d149bddbb5886a
app.use(cookieParser());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'));

<<<<<<< HEAD
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
=======
app.use('/auth', require('./routes/auth'));  
app.use('/user', require('./routes/user')); 
app.use('/gmail', require('./routes/gmail')); 

>>>>>>> 4e96b110194b9d3d7743cc41d0d149bddbb5886a

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);
