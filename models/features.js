const mongoose = require('mongoose')

const featureSchema = new mongoose.Schema({
    blogid:{
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
})

const feature = mongoose.model('features', featureSchema)
module.exports = feature