const mongoose = require('mongoose');
const Joi = require('joi');

// creates schema for comments
const comment_schema = new mongoose.Schema({
    user_email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

// creates schema for posts
const post_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    comments: [comment_schema],
    created_by: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

// creates model for posts
const Post = mongoose.model('Post', post_schema);

is_a_post = (post) => {
    let schema = {
        title: Joi.string().required(),
        text: Joi.string().required(),
        created_by: Joi.string().required()
    };

    return Joi.validate(post, schema);
};

module.exports = {
    Post,
    is_a_post
};