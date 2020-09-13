const mongoose = require('mongoose')

//setting Comment Format
const commentSchema = new mongoose.Schema({
    blogid:{
        type: mongoose.Schema.Types.ObjectId
    },
    comment:{
        type:String
    },
    username:{
        type: String
    }
});




//packing schema to model and exporting
const Comment = mongoose.model('Comments', commentSchema);
module.exports = Comment