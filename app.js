const express = require('express');
const post_route = require('./routes/post');
const mongoose = require('./dbs/mongoose');

// creates app
const app = express();

// adds a middleware that enables the document from request in req.body
app.use(express.json());

// adds post's router in app
app.use('/api/post', post_route);

// connects to mongoose
mongoose.connect();

// sets app port
const port = process.env.APP_PORT;
app.listen(port, () => console.log(`App running on port ${port}`));