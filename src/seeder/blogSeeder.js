const { faker } = require('@faker-js/faker');
const connectDB = require('../config/db');
const mongoose = require('mongoose')
const Blog = require('../schema/blogSchema');




const seeder = async () => {

    try{

        connectDB();
        const blogs = [];
        
        for(let i = 1; i <= 1000; i++){
            const date = faker.date.anytime().toISOString().slice(0,10);
            const content = faker.lorem.paragraph(5);
            blogs.push({
                id:i,
                title:faker.word.words(8),
                author:faker.person.fullName(),
                published_date:date,
                content:content,
                tags:faker.helpers.arrayElements(["new","sciene","physics","maths","robotics","psychology","biology","algo","api","php","java","javaScript","reactJS","nextJS","pixiJS","c"]),
                keywords:content.split(' '),
                username:faker.internet.userName()
            });
        }
        
        const result = await Blog.insertMany(blogs);
        console.log("blogs inserted : ", result);
    }catch(err){
        console.error("error inserting blogs : ",err.message);
    }
}

seeder();