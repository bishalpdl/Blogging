const express = require('express')
const bcrypt = require('bcryptjs')

const User = require('../models/users')
const auth = require('../middleware/authorize')

const app = express()
const router = express.Router()






router.post('/signup', async(req, res)=>{
    try{
        const user = new User(req.body)
        const token = await user.generateJWT()
        res.cookie('jwt', token, {secure: false, httpOnly:true})
        res.redirect('/blogs')
        //res.send({user, token})
    }catch(e){
        res.render('index', {message: "Error Meassage: Details invalid"})

    }
})

router.post('/login', async(req, res)=>{
    let user;
    try{
        user = await User.findOne({email: req.body.email})
        if(user){
            test = await bcrypt.compare(req.body.password, user.password)
            
            if(test){
                                
            }else{
                throw new Error('Email or Password Errosr')
            }
        }else{
            throw new Error('Email or Password Error')
        }
        

        const token = await user.generateJWT()
        res.cookie('jwt', token, {secure: false, httpOnly:true})
        res.redirect('/blogs')


    }catch(e){
        res.render('index', {message: "Incorrect Details"})
    }


})

router.post('/user/logout',auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()

    }catch(e){
        res.status(500).send("error")
    }
})


router.get('/user/me', auth, async(req, res)=>{
    res.send(req.user)
})








module.exports = router