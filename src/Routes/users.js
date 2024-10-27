const mongoose = require('mongoose');
const User = require('../schema/userSchema');
const express = require('express');
const { getUserById, getUserByUsername, getUserByFirstName, getUserByLastName, insertUser, deleteUserById, patchUserById } = require('../middleware/users');
const router = express.Router();


router.get('/', async (req, res)=>{
    const { page = 1, limit = 20 } = req.query;
    const options = {
      limit : parseInt(limit),
      page : parseInt(page),
    };
  
    const toSkip = (options.page-1) * options.limit
  
    try{
      const users = await User.find().skip(toSkip).limit(options.limit);
      const totalUsers = await User.countDocuments();
      const totalPages = totalUsers/options.limit;
      if(!users){
        res.status(400).send({message : "not found"});
      }
      res.json(
        {
          total_users: totalUsers,
          total_pages : Math.ceil(totalPages),
          current_page: options.page,
          per_page: options.limit,
          users}
      );
    }catch(err){
      console.error("error : ",err);
    }
  })
  
  router.route('/id/:id')
  .get(async (req,res)=>{
    const { id } = req.params;
    const user = await getUserById(id);
    res.json(user);
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      const deletedUser = await deleteUserById(id);
      if (deletedUser) {
        res.json({ success: true, message: 'User deleted successfully', deletedUser });
      } else {
        res.status(404).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, message: 'Error deleting user' });
    }
  }).patch(async (req,res)=>{
    try{
        const updatedUser = await patchUserById(req);
        if(updatedUser){
            res.json({
                updatedUser,
                success:true  
            })
        }else{
            res.json({
                message:"there was an error updating the user",
            })
        }
    }
    catch(err){
        console.error(err);
    }
  })

  router.get('/id/:id/:key', async (req, res) => {
    const { id, key } = req.params;

    try {
        // Dynamically create the projection object for the key
        const projection = { [key]: 1, _id: 0 }; // Only select the key and exclude _id

        // Fetch the blog with only the specified field
        const blog = await User.findOne({ id: parseInt(id) }, projection);

        if (blog && blog[key] !== undefined) {
            // If the blog and the key field exist, respond with the specific field value
            res.json({
                [key]: blog[key],
                success: true,
            });
        } else {
            // If the key is invalid or the blog isn't found
            res.status(404).json({
                success: false,
                message: "Requested field not found in the blog, or blog does not exist.",
            });
        }
    } catch (error) {
        // Catch any errors and send an error response
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the blog field.",
            error: error.message,
        });
    }
});
// handling post requests

router.post('/user', async (req, res)=>{
    const user = await insertUser(req);
    res.json({
        user,
        success:!!user,
    })
});

// router.delete('/id/:')
  

  module.exports = router;