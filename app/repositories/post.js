const {Post} = require('../models/post');
const mongoose = require('mongoose');

async function get_all_posts() {
    return await Post.find();
}

async function get_post_by_title(title) {
    return await Post.findOne({title: title});
}

async function insert_post(object) {
    return await Post(object).save();
}

async function delete_post_by_id(id) {
    return await Post.findByIdAndDelete({_id: id});
}

async function update_post_by_id(id, post) {
    return await Post.findByIdAndUpdate(id, {
        $set: post
    });
}

function is_id_valid(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
    get_all_posts,
    get_post_by_title,
    insert_post,
    delete_post_by_id,
    update_post_by_id,
    is_id_valid
};