const express = require('express')
const path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')




const userRouter = require('../routes/users')
const blogRouter = require('../routes/blogs')
const commentRouter = require('../routes/comments')
require('../models/db-connection')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'));
app.set('view engine', 'ejs')
app.use(express.static("views"));
app.use(express.static(path.join(__dirname, '../views')));
app.use(express.static(path.join(__dirname, '../views/blogs')));
app.set("views", path.join(__dirname, '../views'))

// to use css and js inside of public directory.
app.use('/public', express.static('public'));

 



app.use(userRouter)
app.use(blogRouter)
app.use(commentRouter)
const Feature = require('../models/features')

app.post('/feature', async(req, res)=>{
  const featur = new Feature(req.body)
  console.log(featur)
  await featur.save()
  res.send(featur)
})

















app.listen(port, () => {
  console.log(`Port is running at ${port}`)
})
