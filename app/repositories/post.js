const Joi = require('joi');
const Post = require('../models/post');
const mongoose = require('mongoose');

async function get_all_posts() {
    return await Post.find();
}

async function get_by_title(title) {
    return await Post.findOne({title: title});
}

async function insert_post(object) {
    return await Post(object).save();
}

async function delete_by_id(id) {
    return await Post.findByIdAndDelete({_id: id});
}

function is_a_post(post) {
    let schema = {
        title: Joi.string().required(),
        text: Joi.string().required(),
        created_by: Joi.string().required()
    };

    return Joi.validate(post, schema);
}

function is_id_valid(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
    get_all_posts,
    get_by_title,
    insert_post,
    delete_by_id,
    is_a_post,
    is_id_valid
};