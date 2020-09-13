const jwt = require('jsonwebtoken')
const User = require('../models/users')


const auth = async(req, res, next) => {
    try{
        var token
        if(req.cookies.jwt){
            token = req.cookies.jwt
        }else{
            token = req.header('Authorization').replace('Bearer ','')
        }

        const decoded = jwt.verify(token, 'darth_vader')
        const user = await User.findOne({_id:decoded._id, 'tokens.token':token})

        if(!user){
            throw new Error()
        }   
        req.token = token
        req.user = user
        next()

    }catch(e){
        res.render('index',{"message": "Please Login or Signup to Complete your Action. "})
        //res.status(403).send({error:"Please Authenticate"})
    }
}

module.exports = auth