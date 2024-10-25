const mongoose = require('mongoose');
require('dotenv').config();
const mongo_uri = process.env.MDB_URI;


const mongoCreds = process.env.MDB_URI;

const connectDB = () => {
    mongoose.connect(mongoCreds)
        .then(()=>console.log("connected"))
        .catch(err => console.error(err));
}

module.exports = connectDB;