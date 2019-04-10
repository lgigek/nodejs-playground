const Joi = require('joi');
const Post = require('../models/post');

async function get_all_posts() {
    return await Post.find();
}

async function get_by_title(title) {
    return await Post.findOne({title: title});
}

async function insert_post(object) {
    return await Post(object).save();
}

function is_a_post(post) {
    let schema = {
        title: Joi.string().required(),
        text: Joi.string().required(),
        created_by: Joi.string().required()
    };

    return Joi.validate(post, schema);
}

module.exports = {
    get_all_posts,
    get_by_title,
    insert_post, is_a_post
};