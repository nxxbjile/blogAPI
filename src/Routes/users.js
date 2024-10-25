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

  router.get('/username/:username',async (req, res)=>{
    const { username } = req.params;
    const user = await getUserByUsername(username);
    res.json({
        user,
        success : true,
    });
  })
  
  router.get('/firstname/:firstname', async (req , res)=>{
    const { firstname } = req.params;
    const { page , limit } = req.query;
    const result = await getUserByFirstName(firstname, page, limit);
    res.json({
        result,
        success: result.length >=1,
    });
  })
  
  router.get('/lastname/:lastname', async (req , res)=>{
    const { lastname } = req.params;
    const { page , limit } = req.query;
    const result = await getUserByLastName(lastname, page, limit);
    res.json({
        result,
        success: result.length >=1,
    });
  })
  
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