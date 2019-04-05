const Joi = require('joi');
const Post = require('../models/post');

async function get_all_posts() {
    return await Post.find();
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

module.exports.get_all_posts = get_all_posts;
module.exports.insert_post = insert_post;
module.exports.validate_request_body = is_a_post;