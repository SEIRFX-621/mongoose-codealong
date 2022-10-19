const express = require('express');
const app = express();
const mongoose = require('mongoose');
 const Post = require('./schemas/post');
 const User = require('./schemas/user');
 const Comment = require('./schemas/comment');
const mongoDb = 'mongodb://127.0.0.1/mongoose-test';
mongoose.connect(mongoDb, {useNewUrlParser: true});
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to mongoDb at ${db.host}:${db.port}`);
});

db.on('error', (error) => {
    console.log(`Database Error: ${error}`);
})

app.use(express.urlencoded({ extended: false}));

//Home
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to our API'
    })
})
//users
app.get('/users', (req, res) => {
    User.find({})
    .then(users => {
        console.log('All users', users);
        res.json({ users: users });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});
//users/:email

app.get('/users/:email', (req, res) => {
    console.log('find user by', req.params.email)
    User.findOne({
        email: req.params.email
    })
    .then(user => {
        console.log('Here is the user', user.name);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});

//Create new user
app.post('/users', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        meta: {
            age: req.body.age,
            website: req.body.website
        }
    })
    .then(user => {
        console.log('New user =>>', user);
        res.json({ user: user });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});
//update user
app.put('/users/:email', (req, res) => {
    console.log('route is being on PUT')
    User.findOne({ email: req.params.email })
    .then(foundUser => {
        console.log('User found', foundUser);
        User.findOneAndUpdate({ email: req.params.email }, 
        { 
            name: req.body.name ? req.body.name : foundUser.name,
            email: req.body.email ? req.body.email : foundUser.email,
            meta: {
                age: req.body.age ? req.body.age : foundUser.age,
                website: req.body.website ? req.body.website : foundUser.website
            }
        })
        .then(user => {
            console.log('User was updated', user);
            res.json({ user: user })
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
//Delete

app.delete('/users/:email', (req, res) => {
    User.findOneAndRemove({ email: req.params.email })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.email} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

// ====================== POST ROUTES ===================

//Posts

app.get('/posts', (req, res) => {
    Post.find({})
    .then(posts => {
        console.log('All posts', posts);
        res.json({ posts: posts });
    })
    .catch(error => { 
        console.log('error', error) 
    });
});
// fins one post (by email)

// app.get('/posts/:title', (req, res) => {
//     console.log('find post by', req.params.title)
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
app.get('/posts/:id', (req, res) => {
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
//Create a post 
app.post('/posts', (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body,
    })
    .then(post=> {
        console.log('New post =>>', post);
        res.json({ post: post });
    })
    .catch(error => { 
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" })
    });
});
//Put Route 
app.put('/posts/:id', (req, res) => {
    console.log('route is being on PUT')
    Post.findById(req.params.id )
    .then(foundPost => {
        console.log('Post found', foundPost);
        Post.findByIdAndUpdate( req.params.id, { 
            title: req.body.title ? req.body.title : foundPost.title,
            body: req.body.body ? req.body.body : foundPost.body,
        }, {
            upsert: true
        })   
        .then(post => {
            console.log('Post was updated', post);
            res.redirect(`/posts/${req.params.id}`)
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
//Delete Route 
app.delete('/posts/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id)
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `Post ${req.params.id} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});

// ===================== Comment Routes ===================

//find all comment 

app.get('/comments', (req, res) => {
    Comment.find({})
    .then(comments => {
        console.log('All comments', comments);
        res.json({ comments: comments });
    })
    .catch(error => { 
        console.log('error', error) 
    });
});
//find one comment( by header)
app.get('/comments/:header', (req, res) => {
    console.log('find comment by', req.params.id)
    Comment.findById(req.params.id)
    .then(comment => {
        console.log('Here is the comment', comment);
        res.json({ comment: comment });
    })
    .catch(error => { 
        console.log('error', error);
        res.json({ message: "Error ocurred, please try again" });
    });
});
//create a comment 
app.post('/posts/:id/comments', (req, res) => {
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
    // Comment.create({
    //     header: req.body.header,
    //     content: req.body.content,
    // })
    // .then(comment=> {
    //     console.log('New comment =>>', comment);
    //     res.json({ comment: comment });
    // })
    // .catch(error => { 
    //     console.log('error', error) 
    //     res.json({ message: "Error ocurred, please try again" })
    // });
//Put Route 
app.put('/comments/:header', (req, res) => {
    console.log('route is being on PUT')
    Comment.findOne({ header: req.params.header })
    .then(foundComment => {
        console.log('comment found', foundComment);
        Comment.findOneAndUpdate({ header: req.params.header }, 
        { 
            header: req.body.header ? req.body.header : foundUser.header,
            content: req.body.content ? req.body.content : foundUser.content,
        }, {
            upsert: true
        })
        .then(comment => {
            console.log('comment was updated', comment);
            res.json({ comment: comment })
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

//delete route

app.delete('/comments/:header', (req, res) => {
    Comment.findOneAndRemove({ header: req.params.header })
    .then(response => {
        console.log('This was delete', response);
        res.json({ message: `${req.params.header} was deleted`});
    })
    .catch(error => {
        console.log('error', error) 
        res.json({ message: "Error ocurred, please try again" });
    })
});



// app.get('/' , (req, res) => {
//     const bobby = new User({
//         name: 'Robert',
//         email: 'Bobby@test.com',
//         meta: {
//             age: 30, 
//             website: 'https://chris.me'
//         }
//     });
    
//     bobby.save((err) => {
//         if (err) return console.log(err);
//         console.log('User Created!');
//     });

//     res.send(bobby.sayHello());
// })

// app.get('/findAll', (req,res) => {
//     User.find({}, (err, users) => {
//         if (err) res.send(`Failed to find record, mongodb error ${err}`);
//         res.send(users);
//     })
// })

// app.get('/findById/:id', (req,res) => {
//     User.findById(req.params.id, (err, users) => {
//         if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
//         res.send(users);
//     })

    //find by Id without the findByID command, not ideal
    // User.find({_id: mongoose.Types.ObjectId(Objreq.params.id)}, (err, users) => {
    //     if (err) res.send(`Failed to find record by Id, mongodb error ${err}`);
    //     res.send(users);
    // })
// })

// app.get('/findByEmail/:email', (req,res) => {
//     User.findOne({email: req.params.email}, (err, users) => {
//         if (err) res.send(`Failed to find record by email, mongodb error ${err}`);
//         res.send(users);
//     })
// })


// creating users directly form model using model.save() and creating user using mode.Create
// User.create({
//     name: 'created using Create()',
//     email: 'Tester2@gmail.com'
// })

// const newUser = new User({
//     name: 'created using new USer and Save()',
//     email: 'Tester3@gmail.com'
// });

// newUser.save((err) => {
//     if (err) return console.log(err);
//     console.log('created new user');
// })

// Creating a simple post document in the post collection
// Post.create({
//     content: 'This ia pst content...'
// });

//Mongoose update statements
// User.updateOne({name: 'Chris'}, {
//     meta: {
//         age: 56
//     }
// }, (err, updateOutcome) => {
//     if(err) return console.log(err);
// console.log(`update user: ${updateOutcome.matchedCount} : ${updateOutcome.modifiedCount}`) //would expect 1:1
// })

// User.findOneAndUpdate({ name: 'Robert'}, 
// { 
//     meta: {
//         age: 61,
//         website: 'somethingDifferent.com'
// }
// }, (err, user) => {
//     if(err) return console.log(err);
//     console.log(user)
// })

//Mongoose delete statements
    //removes all that match with search query param 
// User.remove({name: 'Robert'}, (err) => {
//     if(err) return console.log(err)
//     console.log('user record deleted')
// })
    //returns record that you delete and remove only one that match with search query param 
// User.findOneAndRemove({name:'Chris'}, (err, user) => {
//     if(err) return console.log(err)
//     console.log(user)
// })

//Post schema with association to comments

// const newPost = new Post({
//     title: 'our first post',
//     body: 'some body text for our post'
// })
// newPost.comments.push({
//     header: 'pur furst comment',
//     content: 'this is my comment text'
// })

// newPost.save(function(err) {
//     if(err) return console.log(err)
//     console.log(`Created post${this.title}`);
// })
// const refPost = new Post ({
//     title: 'post with ref to comments ',
//     body: 'body for ref by comments',
// });
// const refComment= new CommentModel({
//     header: 'our ref comments',
//     content: 'some comment content'
// })
// refComment.save();
// refPost.comments.push(refComment);
// refPost.save();

//find all comments.push(refComment)
// Post.findOne({}, (err, post) => {
//     Post.findById(post._id).populate('comments').exec((err,post => {
//         console.log(post);
//     }))
// })

app.listen(8000, () => {
    console.log('Running port 8000')
});