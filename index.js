require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Post = require('./models/post');
const User = require('./models/user');
const Comment = require('./models/comment');

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true });
const db = mongoose.connection;

db.once('open', () => {
    console.log(`Connected to MongoDB at HOST: ${db.host} and PORT: ${db.port}`);
});

db.on('error', (error) => {
    console.log(`Database Error: ${error}`);
})

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to API' });
});

// ================ USERS ROUTES ========================
app.use('/users', require('./controllers/users'));

// ================ POSTS ROUTES ========================
app.use('/posts', require('./controllers/posts'));

// ================ COMMENTS ROUTES ========================
app.use('/comments', require('./controllers/comments'));


app.get('*', (req, res) => {
    res.json({ message: 'Whatever you were looking for... does not exists.'})
})

app.listen(8000, () => {
    console.log('Running port 8000')
});