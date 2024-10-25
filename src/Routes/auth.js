const express = require('express');
const jwt = require('jsonwebtoken');
const Auth = require('../schema/authSchema');
const bcrypt = require('bcryptjs');
const { Authenticate, hashPassword } = require('../middleware/auth');
require('dotenv').config();
const router = express.Router();

const jwt_secret = process.env.JWT_SECRET_KEY;

router.route('/')
    .post(async (req, res)=>{
        const { username, password } = req.body;
        if(!password){
            res.json({message: " please provide the password for the user"})
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await Auth.create({
            username,
            password:hashedPassword
        })
        if(newUser){
            res.json({
                message : `new user created with username : ${username} and password : ${hashedPassword}`,
                success : true
            })
        }else{
            res.json({
                success: false,
                message:"cannot not create user",
            })
        }
    })
    .get(Authenticate, async (req, res)=>{
        const users = await Auth.find();
        if(users){
            res.json({
                users,
                success:true,
            })
        }else{
            res.json({
                message:"something went wrong",
            })
        }
    })
router.post('/login', async (req, res)=>{
    const { username , password } = req.body;
    const user = await Auth.findOne({username});
    const expiry = '1h';
    if(user){
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            const token = jwt.sign({ username: username} , jwt_secret, { expiresIn : expiry});
            res.json({
                message:"logged in successfully!",
                success : true,
                user:{
                    username,
                },
                token:token,
                expires_in:expiry,
            });
        }
        if(!isMatch){
            res.json({
                message:"Wrong password!",
            })
        }
    }else{
        res.json({
            message : "user not found try agian",
            success : false,
        })
    }
        
})

router.post('/signup',async (req, res)=>{
    const { username, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await Auth.create(
        { username: username,
        password : hashedPassword}
    );
    if(user){
        res.json({
            message:"user created Successfully",
            success:true,
        })
    }else{
        res.json({
            message : " User Not Created",
            success: false,
        })
    }
})

module.exports = router;