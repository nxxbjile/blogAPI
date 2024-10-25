const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    id:{            type : Number, required : true, unique : true},
    title:{         type : String, required : true},
    author:{        type : String, required : true},
    username:{      type : String, required : true, unique : true},
    published_date:{type : String, required : true},
    content:{       type : String, required : true},
    tags:{          type : [String]},
    keywords:{      type : [String]}
})

const Blog = mongoose.model('Blog',blogSchema);

module.exports = Blog;