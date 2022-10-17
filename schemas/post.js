const mongoose = require ('mongoose');
const {commentSchema} = require ('./comment')
const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    comments: [commentSchema],
    refComments: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }]
});

module.exports = mongoose.model('Post', postSchema)