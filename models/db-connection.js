const mongoose = require('mongoose');
require('dotenv').config

uri = process.env.MONGO_URI
//uri = ""
mongoose.connect(uri || 'mongodb://127.0.0.1:27017/blogs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
});

