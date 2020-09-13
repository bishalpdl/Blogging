const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Blog = require('./blogs')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        //required:true
    },
    email:{
        type:String,
        required: true,
        //unique:true,
        validate: {
            validator: function(v) {
                if(!validator.isEmail(v)){
                    throw new Error('not and email')
                }
            }
        }
    },
    password:{
        type: String,
        minlength:5,
        //required:true
    },
    tokens: [{
        token:{
            type:String,
            //required: true
        }
    }]
})

userSchema.virtual('blogs',{
    ref:'Blog',
    localField: '_id',
    foreignField: 'author'
})





userSchema.methods.generateJWT = async function(){
    const token = jwt.sign({_id: this._id.toString()}, 'darth_vader')
    this.tokens = this.tokens.concat({token:token})
    await this.save()
    return token
}




userSchema.pre('save', async function(req, res, next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

userSchema.methods.toJSON = function(){
    const userObject = this.toObject()

    delete userObject.password
    delete userObject.tokens
    
    return userObject
}






//packing schema to model and exporting
const User = mongoose.model('Users', userSchema);
module.exports = User