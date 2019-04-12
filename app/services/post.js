const repository = require('../repositories/post');
const {is_a_post} = require('../models/post');
const Response = require('./responses');

get_all_posts = async (req, res) => {
    console.log(`HTTP Request to get all posts`);
    let posts = await repository.get_all_posts();

    return Response.all_posts(res, posts);
};

get_post_by_id = async (req, res) => {
    let id = req.params.id;
    console.log(`HTTP Request to get post with id: ${id}`);

    if (is_id_invalid(res, id)) return;

    let result = await repository.get_post_by_id(id);
    if (result)
        return Response.post_found(res, result);
    else
        return Response.post_not_found(res);
};

create_post = async (req, res) => {
    let post = req.body;
    console.log(`HTTP Request to create a new post with data: ${JSON.stringify(post)}`);

    if (is_body_invalid(res, post)) return;

    if (await is_title_duplicated(res, post.title)) return;

    // tries to create e new post
    try {
        let result = await repository.insert_post(post);
        return Response.post_created(res, result);
    } catch (err) {
        return Response.generic_error(res, err);
    }

};

delete_post = async (req, res) => {
    let id = req.params.id;
    console.log(`HTTP Request to delete a post with id: ${id}`);

    if (is_id_invalid(res, id)) return;

    let result = undefined;
    // tries to delete the post
    try {
        result = await repository.delete_post_by_id(id);
    } catch (err) {
        return Response.generic_error(res, err);
    }

    // verifies if post exists
    if (!result) {
        return Response.post_not_found(res);
    } else {
        return Response.post_deleted(res, result);
    }
};

update_post = async (req, res) => {
    let id = req.params.id;
    let post = req.body;
    console.log(`HTTP Request to update a post with id: ${id}, and body: ${JSON.stringify(post)}`);

    if (is_id_invalid(res, id)) return;

    if (is_body_invalid(res, post)) return;

    let post_by_id = await repository.get_post_by_id(id);
    if (!post_by_id)
        return Response.post_not_found(res);

    if (await is_title_duplicated(res, post.title, id)) return;

    // tries to update the post
    try {
        let result = await repository.update_post_by_id(id, post);
        return Response.post_updated(res, result);
    } catch (err) {
        return Response.generic_error(res, err);
    }
};

/*
    Verifies if body is valid according to JOI schema.
    If valid, returns nothing.
    If nothing, returns the request's response with 400
 */
is_body_invalid = (res, body) => {
    let {error} = is_a_post(body);
    if (error) {
        // formats the error reason
        let detail = error.details[0].message;
        detail = detail.replace(/"/g, '\'');

        return Response.invalid_body(res, detail);
    }
};

/*
    Verifies if exists a post with same title.
    If exists, returns the request's response with 400.
    If not, returns nothing.

    Also, if "id" is informed, compares it to "_id" from database object
    If equal, returns nothing.
    If exists, returns the request's response with 400.
 */
is_title_duplicated = async (res, title, id = undefined) => {
    let post_found = await repository.get_post_by_title(title);

    if (post_found) {
        if (id && post_found._id.toString() === id) return;

        return Response.duplicated_title(res);
    }
};

/*
    Verifies if id is valid according to mongoose.
    If valid, returns nothing.
    If not, returns the request's response with 400.
 */
is_id_invalid = (res, id) => {
    if (!repository.is_id_valid(id)) {
        return Response.invalid_id(res);
    }
};

module.exports = {
    get_all_posts,
    get_post_by_id,
    create_post,
    delete_post,
    update_post
};