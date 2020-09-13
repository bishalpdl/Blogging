const mongoose = require('mongoose')

//setting blogschema
const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        //required: true
    },
    description:{
        type:String
    },
    visitor:{
        type:Number,
        default:1,
    },
    category:{
        tyep:String
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        //required: true,
        ref: 'User'
    },
    author_username:{
        type: String
    },
    picture:{
        type: Buffer
    }

},{
    timestamps:true
});




//packing schema to model and exporting
const Blog = mongoose.model('Blogs', blogSchema);
module.exports = Blog