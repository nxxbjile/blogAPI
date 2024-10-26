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
  
router.get('/id/:id/:key', async (req, res) => {
    const { id, key } = req.params;

    try {
        // Dynamically create the projection object for the key
        const projection = { [key]: 1, _id: 0 }; // Only select the key and exclude _id

        // Fetch the blog with only the specified field
        const blog = await Blog.findOne({ id: parseInt(id) }, projection);

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
module.exports = router;