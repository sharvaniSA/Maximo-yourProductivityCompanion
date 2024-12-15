const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Import bcrypt for password hashing

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Password field
});

// Pre-save hook to hash password before saving to database
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only hash if password is modified

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with the stored hashed password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
