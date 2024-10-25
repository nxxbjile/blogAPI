const { faker } = require('@faker-js/faker');
const connectDB = require('../config/db');
const mongoose = require('mongoose')
const User = require('../schema/userSchema');


connectDB();

const seeder = async () => {
    try{
        const users = [];
        
        for(let i = 1; i <= 1000; i++){
            users.push({
                id:i,
                first_name:faker.person.firstName(),
                last_name:faker.person.lastName(),
                email:faker.internet.email(),
                username:faker.internet.userName(),
                total_blogs:faker.number.int({ max : 20 })
            });
        }
        
        const result = await User.insertMany(users);
        console.log("users inserted : ", result);
    }catch(err){
        console.error("error inserting users : ",err.message);
    }
}

seeder();