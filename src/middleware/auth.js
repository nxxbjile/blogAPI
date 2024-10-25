const express = require('express');
const bcrypt = require('bcryptjs');
const Auth = require('../schema/authSchema');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET_KEY;

const Authenticate = async (req , res, next) =>{
   const authHeader = req.headers['authorization'];
   if(!authHeader){
    return res.json({
        message : "Authorization header is missing",
    })
   }
   
   const token = authHeader.split(' ')[1];
   if(!token){
    res.json({
        message:"token is missing",
    })
   }
  jwt.verify(token, jwt_secret, (err, user)=>{
    if(err){
        res.status(403).json({
            message:"failed to verify the token",
        })
    }
    req.user = user;
    next();
   })
}

const hashPassword = async (plainpPassword) =>{
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainpPassword, saltRounds);
    return hashedPassword;
}


module.exports = { Authenticate, hashPassword };