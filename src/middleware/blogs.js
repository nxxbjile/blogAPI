const Blog = require('../schema/blogSchema')
const mongoose = require('mongoose');

const getAllBlogs = async (page = 1, limit = 20) => {

    const options = {
      limit : parseInt(limit),
      page : parseInt(page),
    };
  
    const toSkip = (options.page-1) * options.limit
    const blogs = await Blog.find().skip(toSkip).limit(options.limit);
    const totalBlogs = await Blog.countDocuments();
    const totalPages = totalBlogs/20;
    if(!blogs){
    res.status(400).send({message : "not found"});
    }else{
        return{
            total_blogs: totalBlogs,
            total_pages : Math.ceil(totalPages),
            current_page: page,
            showing: {
            from : toSkip,
            to: toSkip + limit
            },
            per_page: limit,
            blogs
        };
    }

  }

  const patchBlog = async (req) => {
    const updatedBlog = await Blog.findOneAndUpdate(
      { id : parseInt(req.params.id)},
      { $set : req.body },
      { new : true },
    )

    if(updatedBlog){
      return updatedBlog;
    }
  }

const deleteBlog = async( req) => {
  const deleted = await Blog.findOneAndDelete({ id : parseInt(req.params.id)});
  if(deleted){
    return deleted;
  }
}

const searchBlog = async (req,term) => {
  const { page = 1, limit = 10 } = req.query;
  const toSkip = (page - 1) * limit;
  const totalBlogs = await Blog.countDocuments({ title : { $regex : `${term}` , $options : 'i'}},
  );
  const totalPages = Math.ceil(totalBlogs/limit);
  const found = await Blog.find(
    { title : { $regex : `${term}` , $options : 'i'}},
  ).skip(toSkip).limit(limit)
  console.log("search : ",term)
  if(found){
    return {found, page, totalPages};
  }
}

const searchBlogByKeyword = async (req,term) => {
  const { page = 1, limit = 10 } = req.query;
  const toSkip = (page - 1) * limit;
  const totalBlogs = await Blog.countDocuments({ keywords :term},
  );
  const totalPages = Math.ceil(totalBlogs/limit);
  const found = await Blog.find(
    { keywords : { $regex : `${term}` , $options : 'i'}},
  ).skip(toSkip).limit(limit)
  console.log("search : ",term)
  if(found){
    return {found, page, totalPages, totalBlogs};
  }
}

const findBlogsGlobal = async (req) => {
  const { keyword = '', tag = '', term='', page = 1, limit = 10} = req.query;
  const toSkip = (page - 1) * limit;
  const queryArray = {
    $or:[
      { keywords : { $regex : keyword, $options : 'i'}},
      { tags : { $regex : tag, $options : 'i'}},
      { title : { $regex : term, $options : 'i'}},
    ]
  };

  const foundBlogs = await Blog.find(queryArray).skip(toSkip).limit(limit);
  const totalBlogs = await Blog.countDocuments(queryArray);
  const totalPages = Math.ceil(totalBlogs/limit);

  if(foundBlogs){
    return {
      foundBlogs, page, totalPages, totalBlogs
    }
  }
}

  module.exports = { getAllBlogs, patchBlog, deleteBlog, searchBlog, searchBlogByKeyword, findBlogsGlobal}