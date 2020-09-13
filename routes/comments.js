const express = require('express')
const mongoose = require('mongoose')
const Comment = require('../models/comments')
const auth = require('../middleware/authorize')

const app = express()
const router = express.Router()


router.get('/', async(req, res)=>{
    comment = await Comment.find({})
    res.send(comment)
})

router.post('/writecomment/:id', auth, async(req, res)=>{
    try{
        const comment = new Comment({
            ...req.body,
            username: req.user.username,
            blogid: req.params.id
        })
        await comment.save()
        res.redirect('back');
        
    }catch(e){
        res.status(400).send("hellow")
    }
})

router.delete('/deletecomment/:id', async(req,res)=>{
    try{
        const comment = await Comment.findByIdAndDelete({_id: req.params.id})
        res.send(comment)
    }catch(e){
        res.send(e)
    }
})

module.exports = router