const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    total_blogs: { type: Number, required: true }
})


const User = mongoose.model('user', userSchema);

module.exports = User;