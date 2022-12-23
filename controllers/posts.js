const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');


router.get('/', (req, res) => {
    Post.find({})
    .then(posts => {
        console.log('All posts', posts);
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error', error)
        res.json({ message: 'Error occured, please try again' });
    });
});

// router.get('/:title', (req, res) => {
//     console.log('find post by', req.params.title);
//     Post.findOne({
//         title: req.params.title
//     })
//     .then(post => {
//         console.log('Here is the post', post);
//         res.json({ post: post });
//     })
//     .catch(error => { 
//         console.log('error', error);
//         res.json({ message: "Error ocurred, please try again" });
//     });
// });

router.get('/:id', (req, res) => {
    console.log('find post by ID', req.params.id);
    // console.log(mongoose.Types.ObjectId(req.params.id))
    Post.findOne({ _id: mongoose.Types.ObjectId(req.params.id) })
    .then(post => {
        console.log('Here is the post', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});


router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body,
    })
    .then(post => {
        console.log('New post =>>', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});

router.put('/:id', (req, res) => {
    console.log('route is being on PUT')
    Post.findById(req.params.id)
    .then(foundPost => {
        console.log('Post found', foundPost);
        Post.findByIdAndUpdate(req.params.id, { 
                title: req.body.title ? req.body.title : foundPost.title,
                body: req.body.body ? req.body.body : foundPost.body,
        }, { 
            upsert: true 
        })
        .then(post => {
            console.log('Post was updated', post);
            res.redirect(`/posts/${req.params.id}`);
        })
        .catch(error => {
            console.log('error', error) 
            res.json({ message: "Error ocurred, please try again" })
        })
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    })
});


router.delete('/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id)
    .then(response => {
        console.log('This was deleted', response);
        res.json({ message: `Post ${req.params.id} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});


// =============== BELOW RELATED TO COMMENTS ======================

// GET a post's comments
router.get('/:id/comments', (req, res) => {
    Post.findById(req.params.id).populate('comments').exec()
    .then(post => {
        console.log('Hey is the post', post);
    })
})

// create a comment on a post
router.post('/:id/comments', (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        console.log('Heyyy, this is the post', post);
        // create and pust comment inside of post
        Comment.create({
            header: req.body.header,
            content: req.body.content
        })
        .then(comment => {
            post.comments.push(comment);
            // save the post
            post.save();
            res.redirect(`/posts/${req.params.id}`);
        })
        .catch(error => { 
            console.log('error', error);
            res.json({ message: "Error ocurred, please try again" });
        });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

module.exports = router;