const express = require('express');
const { getAllBlogs, patchBlog, deleteBlog, searchBlog } = require('../middleware/blogs');
const Blog = require('../schema/blogSchema');
const { Authenticate } = require('../middleware/auth');
const router = express.Router();


router.get('/', async (req , res)=>{
    const { page , limit } = req.query;
    const result = await getAllBlogs(page, limit);
    res.json(result);
  })
  
router.post('/blog', async (req,res)=>{
    const {
        id = await Blog.countDocuments() + 3,
        title,
        author,
        username,
        published_date = new Date().toISOString().slice(0,10),
        content,
        tags,
        keywords,
    } = req.body;

    const blog = await Blog.create({
        id,
        title,
        author,
        username,
        published_date,
        content,
        tags,
        keywords,
    });

    if(blog){
        res.json({
            message : "New blog created successfully!",
            blog,
            success: true,
        })
    }else{
        res.json({
            message:"New Blog CANNOT be created",
            success: false,
        })
    }
})

router.route('/id/:id')
  .get(async (req, res)=>{
    const { id } = req.params;
    const blog = await Blog.findOne({ id : parseInt(id)});
    if(blog){
        res.json({
            success : true,
            blog,
        })
    }else{
        res.json({
            message : "can not find the blog with this id",
            success : false,
        })
    }
  })
  .patch(Authenticate,async (req, res)=>{
    const blog = await patchBlog(req);
    if(blog){
        res.json({
            message : "blog successfully updated",
            blog,
            success : true
        })
    }else{
        res.json({
            message : " there wa a problem updating the blog with this id",
            blog,
            success:false,
        })
    }
  })
  .delete(Authenticate,async (req, res)=>{
    const blog = await deleteBlog(req);
    if(blog){
        res.json({
            message : " blog deleted successfully!",
            blog,
            success: true,
        })
    }else{
        res.json({
            message:"there was a problem deleting the blog with this id",
            success: false,
            blog
        })
    }
  })

  router.get('/id/:id/tags',async (req, res)=>{
    const { id } = req.params;
    const getTags = await Blog.findOne(
        { id : parseInt(id)}, 'tags'
    )
    if(getTags){
        res.json({
            getTags,
            success : true,
        })
    }else{
        res.json({
            message : "Can't get the tags of the given id",
            success : false,
        })
    }
  })
  
  router.get('/id/:id/author',async (req, res)=>{
    const { id } = req.params;
    const getTags = await Blog.findOne(
        { id : parseInt(id)}, 'username'
    )
    if(getTags){
        res.json({
            getTags,
            success : true,
        })
    }else{
        res.json({
            message : "Can't get the author of the given blog id",
            success : false,
        })
    }
  })

  router.get('/id/:id/title',async (req, res)=>{
    const { id } = req.params;
    const getTags = await Blog.findOne(
        { id : parseInt(id)}, 'title'
    )
    if(getTags){
        res.json({
            getTags,
            success : true,
        })
    }else{
        res.json({
            message : "Can't get the title of the given blog id",
            success : false,
        })
    }
  })

  router.get('/id/:id/keywords',async (req, res)=>{
    const { id } = req.params;
    const getTags = await Blog.findOne(
        { id : parseInt(id)}, 'keywords'
    )
    if(getTags){
        res.json({
            getTags,
            success : true,
        })
    }else{
        res.json({
            message : "Can't get the keywords of the given blog id",
            success : false,
        })
    }
  })

  router.get('/id/:id/content',async (req, res)=>{
    const { id } = req.params;
    const getTags = await Blog.findOne(
        { id : parseInt(id)}, 'content'
    )
    if(getTags){
        res.json({
            getTags,
            success : true,
        })
    }else{
        res.json({
            message : "Can't get the content of the given blog id",
            success : false,
        })
    }
  })
module.exports = router;