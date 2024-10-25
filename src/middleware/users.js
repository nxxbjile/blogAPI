const mongoose = require('mongoose');
const User = require('../schema/userSchema');

const getNextId = async () => {
  const lastUser = await User.countDocuments();
  return parseInt(lastUser) + 1;  // If no users exist, start with ID 1
};

// Function to find a user by ID
const getUserById = async (id) => {
  const user = await User.findOne({ id: id });
  return user || { message : "no user found with this id"};
};

// Function to find users by username (case-insensitive search)
const getUserByUsername = async (username) => {
  const users = await User.find({ username: { $regex: username, $options: 'i' } });
  return users.length >= 1 ? users : { success: false };
};

// Function to find users by first name with pagination
const getUserByFirstName = async (firstname, page = 1, limit = 20) => {
  const totalUsers = await User.countDocuments({ first_name: { $regex: firstname, $options: 'i' } });
  const totalPages = Math.ceil(totalUsers / limit);
  const toSkip = (page - 1) * limit;
  const users = await User.find({ first_name: { $regex: firstname, $options: 'i' } }).skip(toSkip).limit(limit);

  if (users) {
    return {
      total_users: totalUsers,
      total_pages: Math.ceil(totalPages),
      current_page: page,
      showing: {
        from: toSkip + 1,
        to: Math.min(toSkip + limit, totalUsers),
      },
      per_page: limit,
      users
    };
  }
};

// Function to find users by last name with pagination
const getUserByLastName = async (lastname, page = 1, limit = 20) => {
  const totalUsers = await User.countDocuments({ last_name: { $regex: lastname, $options: 'i' } });
  const totalPages = Math.ceil(totalUsers / limit);
  const toSkip = (page - 1) * limit;
  const users = await User.find({ last_name: { $regex: lastname, $options: 'i' } }).skip(toSkip).limit(limit);

  if (users) {
    return {
      total_users: totalUsers,
      total_pages: Math.ceil(totalPages),
      current_page: page,
      showing: {
        from: toSkip + 1,
        to: Math.min(toSkip + limit, totalUsers),
      },
      per_page: limit,
      users
    };
  }
};

// Insert a new user with auto-incremented ID
const insertUser = async (req) =>{
  const { username, first_name, last_name, email, total_blogs} = req.body;
  const newId = await getNextId();
  const idTest = await User.find({ id : parseInt(newId)});
  const newUser = new User({
    id : idTest ? parseInt(newId) +2 : parseInt(newId),
    username,
    first_name,
    last_name,
    email,
    total_blogs
  })
  await newUser.save();
  return newUser;
}

const deleteUserById = async (id) => {
  const deleted = await User.findOneAndDelete({ id : parseInt(id) });
  return deleted;
}

const patchUserById = async(req) => {
  const { id } = req.params;
  const user = await User.findOneAndUpdate({ id : parseInt(id)},{$set : req.body}, { new : true});
  return user;
}
module.exports = { getUserById, getUserByUsername, getUserByFirstName, getUserByLastName, insertUser , deleteUserById, patchUserById };
