const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./Routes/users')
const blogRoutes = require('./Routes/blogs')
const searchRoutes = require('./Routes/search');
const {Authenticate} = require('./middleware/auth');
const authRoutes = require('./Routes/auth')
const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended : true}));


app.use('/users',Authenticate, userRoutes);
app.use('/blogs',blogRoutes);
app.use('/search',searchRoutes);
app.use('/auth', authRoutes);

app.use((req,res)=>{
  res.json({
    message:"Requested endpoint or method doesn't exist",
    success:false,
  })  
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
  console.log("server started on PORT : ",PORT);
})