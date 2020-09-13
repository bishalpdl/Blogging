const express = require('express')
const multer = require('multer')
var cron = require('node-cron');


const Blog = require('../models/blogs')
const Comment = require('../models/comments')
const Feature = require('../models/features')
const auth = require('../middleware/authorize')

const app = express()
const router = express.Router({ strict: false })
const path = require('path')
const { title } = require('process')


router.get('/', async(req, res)=>{
    res.render('index', {message: "Enter your Credentials to continue"})
})

router.get('/newblog',auth, async(req, res)=>{
    res.render('newblog')
})


// router.get('/blogs', async(req, res)=>{
//     blogs = await Blog.find({})
//     res.render('blogHome')
// })
router.get('/blogs',async(req, res)=>{
    discover = await Feature.find({}).limit(2)
    featur = []
    for (i=1; i <= 2; i++){
        _id = discover[i-1].blogid
        d= await Blog.findOne({_id})
        d.picture = d.picture.toString('base64')
        featur.push(d)
    }

    blogs_no = await Blog.countDocuments()
    let random_blogs=[]
    let already = []
    for (i=1; i<6; i++){
        let skipper = Math.floor(Math.random() * blogs_no)
        if(!already.includes(skipper)){
            let random_blog = await Blog.findOne({}).skip(skipper)
            random_blog.picture = random_blog.picture.toString('base64')
            random_blogs.push(random_blog)
            already.push(skipper)
        }else{        
            i--   
        }    
    }

    const popular_blogs = await Blog.find({}).sort({'visitor':-1}).limit(5).select('id title')    

    
    res.render('homepage', {featur, random_blogs, popular_blogs})
})





router.get('/blogs/', async(req, res)=>{
    res.redirect('/blogs')
})




router.get('/blog/:id',async (req,res)=>{
    try{
        const blog = await Blog.findById({_id: req.params.id})
        let comment = await Comment.find({blogid: req.params.id})
        
        if(blog.visitor){
            blog.visitor +=1;
        }else{
            blog.visitor = 0
        }
        await blog.save()

        blog.visitor -= 1
        //res.send({blog,comment})
        blog.picture = blog.picture.toString('base64')

        res.render('blogbyid', {blog, comment})
    }catch(e){
        res.send(e)
    }
})

var upload = multer({
    limits:{
        fileSize:5242880 //5MB in byte
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Upload an Image with .jpg, .jpeg or png format'))
        }
        cb(undefined, true)
    }
})


router.post('/upload/picture', auth, upload.single('picture'), async(req, res)=>{
    let picture = req.file.buffer
    let blog = new Blog({picture:picture})
    await blog.save()
    console.log(picture)
    res.status(200).send("uploaded")
}, (error, req, res, next)=>{
    res.status(400).send({error: 'Upload Image less than 5MB'})
})


router.post('/writeblog', auth, upload.single('picture'), async(req,res)=>{
    try{
        let picture = req.file.buffer
        console.log(picture)
        const blog = new Blog({
            ...req.body,
            author: req.user._id,
            author_username: req.user.username
        })
        console.log(picture)
        console.log('hello')
        blog.picture = picture
        await blog.save()
        //res.send(blog)
        //res.redirect(req.get('referer'));
        res.redirect(`/blog/${blog.id}`)

    }catch(e){
        res.redirect('back');

        //res.send(error)
    }
})


router.get('/myblogs', auth, async(req, res)=>{
    let blogs = await Blog.find({author: req.user._id}).sort({createdAt: 'desc'})
    
    for(let i=0; i<blogs.length; i++){
        

        if(blogs[i].description.length > 300){
            blogs[i].description = blogs[i].description.slice(0,250) + '......'
        }
        if(blogs[i].title.length > 36){
            blogs[i].title = blogs[i].title.slice(0,36) + "..."
        }

    }

    res.render('myblogs', {blogs})
})


router.get('/editblog/:id', auth, async(req, res)=>{
    try{
        const blog = await Blog.findOne({_id:req.params.id, author:req.user.id})
        if(blog){
            res.render('editblog', {blog})
        }else{
            res.send("Can't edit")
        }
    }catch(e){
        res.send("Can't edit")
    }
})

router.post('/editblog/:id', auth, async(req, res)=>{
    try{

        const updates = Object.keys(req.body)
        const allowedUpdates = ['title', 'description']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
    
    
        blog= await Blog.findOne({_id: req.params.id, author: req.user._id})
        if(!blog){
            return res.status(404).send({error: "Not found"})
        }

        updates.forEach((update)=>{
            blog[update] = req.body[update]
        })
        await blog.save()

        //res.send(blog)
        res.redirect(`/blog/${blog.id}`)
        

    }catch(e){
        res.send({error:e, description: "not found"})
    }
})

router.delete('/deleteblog/:id', auth, async(req,res)=>{
    try{
        
        const blog = await Blog.findOne({_id: req.params.id, author: req.user._id})
        
        if(blog){
            await blog.remove()
            comment = await Comment.deleteMany({blogid: req.params.id})
            res.redirect('/myblogs')
        }else{
            res.status(404).send({error: 'Not found'})
        }

    }catch(e){
        res.send(blog)
    }
})


router.get('/picture/:id', async(req, res)=>{
    let blog = await Blog.findOne({_id: req.params.id})
    //console.log(blog)

    picture = blog.picture.toString('base64')
    //console.log(picture)
    
    res.render('picture', {picture})

})




// router.get('/random', async(req, res)=>{

//     discover = await Feature.find({}).limit(2)
//     featur = []
//     for (i=1; i <= 2; i++){
//         _id = discover[i-1].blogid
//         d= await Blog.findOne({_id}).select('title description')
//         featur.push(d)
//     }


//     blogs_no = await Blog.countDocuments()
//     let random_blogs=[]
//     let already = []
//     for (i=1; i<6; i++){
//         let skipper = Math.floor(Math.random() * blogs_no)
//         if(!already.includes(skipper)){
//             let random_blog = await Blog.findOne({}).skip(skipper)
//             random_blogs.push(random_blog)
//             already.push(skipper)
//         }else{        
//             i--   
//         }    
//     }

//     const popular_blogs = await Blog.find({}).sort({'visitor':-1}).limit(5).select('title description visitor')    
//     res.send({featur, random_blogs, popular_blogs})
// })


// router.get('/hawa',async(req, res)=>{
//     discover = await Feature.find({}).limit(2)
//     featur = []
//     for (i=1; i <= 2; i++){
//         _id = discover[i-1].blogid
//         d= await Blog.findOne({_id})
//         d.picture = d.picture.toString('base64')
//         featur.push(d)
//     }

//     blogs_no = await Blog.countDocuments()
//     let random_blogs=[]
//     let already = []
//     for (i=1; i<6; i++){
//         let skipper = Math.floor(Math.random() * blogs_no)
//         if(!already.includes(skipper)){
//             let random_blog = await Blog.findOne({}).skip(skipper)
//             random_blog.picture = random_blog.picture.toString('base64')
//             random_blogs.push(random_blog)
//             already.push(skipper)
//         }else{        
//             i--   
//         }    
//     }

//     const popular_blogs = await Blog.find({}).sort({'visitor':-1}).limit(5).select('id title')    

    
//     res.render('homepage', {featur, random_blogs, popular_blogs})
// })











// cron.schedule('30,00 * * * * *', function(){
//     console.log('Runing Automatically!!!');
// });
  





module.exports = router