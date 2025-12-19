const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: String,
  email: String,
}, { timestamps: true });

<<<<<<< HEAD
module.exports = mongoose.model('User', userSchema);
=======
module.exports = mongoose.model('User', userSchema);
>>>>>>> 4e96b110194b9d3d7743cc41d0d149bddbb5886a
