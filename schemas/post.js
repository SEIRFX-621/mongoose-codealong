const mongoose = require ('mongoose');
// const {commentSchema} = require ('./comment')
const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    // comments: [commentSchema],
    comments: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Post', postSchema)