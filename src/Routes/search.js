const express = require('express');
const { searchBlog, searchBlogByKeyword, findBlogsGlobal } = require('../middleware/blogs');

const router = express.Router();

router.get('/title/:title', async (req, res)=>{
    const { title } = req.params;
    const {found, page, totalPages } = await searchBlog(req,title);
    if(found.length >= 1){
        res.json({
            message:"blog(s) found with this search term",
            success:true,
            count: found.length,
            blogs:found,
            total_pages:totalPages,
        })
    }else{
        res.json({
            message:"Can't find any bolg with this search term",
            success:false,
        })
    }
})

router.get('/keyword/:keyword', async (req, res)=>{
    const { keyword } = req.params;
    const {found, page, totalPages, totalBlogs } = await searchBlogByKeyword(req,keyword);
    if(found.length >= 1){
        res.json({
            message:"blog(s) found with this search term",
            success:true,
            count: found.length,
            blogs:found,
            total_pages:totalPages,
            total_blogs:totalBlogs,
        })
    }else{
        res.json({
            message:"Can't find any bolg with this search term",
            success:false,
        })
    }
})

router.get('/global', async (req, res)=>{
    const {foundBlogs, page, totalPages, totalBlogs}  = await findBlogsGlobal(req);
    if(foundBlogs){
        res.json({
            message : "blogs found with the search",
            success:true,
            foundBlogs,
            count: foundBlogs.length,
            total_pages:totalPages,
            total_blogs:totalBlogs,
        })
    }else{
        res.json({
            message:"can't find anything",
            success:false,
        })
    }
})


module.exports = router;