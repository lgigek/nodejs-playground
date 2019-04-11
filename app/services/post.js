const repository = require('../repositories/post');
const {is_a_post} = require('../models/post');

get_all_posts = async (req, res) => {
    console.log(`HTTP Request to get all posts`);
    let posts = await repository.get_all_posts();

    console.log('Retrieving all posts');
    res.status(200).send(posts);
};

get_post_by_id = async (req, res) => {
    let id = req.params.id;
    console.log(`HTTP Request to get post with id: ${id}`);

    if (is_id_invalid(res, id)) return res.end();

    await repository.get_post_by_id(id)
        .then(post => {
            console.log('Post found! Returning its content');
            return res.status(200).send(post);
        })
        .catch(() => {
            console.log('No post found, returning 404');
            return res.status(404).send({message: 'Post not found'});
        });
};

create_post = async (req, res) => {
    let post = req.body;
    console.log(`HTTP Request to create a new post with data: ${JSON.stringify(post)}`);

    if (is_body_invalid(res, post)) return res.end();

    if (await is_title_duplicated(res, post.title)) return res.end();

    // tries to create e new post
    try {
        let result = await repository.insert_post(post);
        console.log('Successfully created de post');
        return res.status(201).send(result);
    } catch (ex) {
        console.log(`Error caught when trying to add a new post. Error: ${ex}`);
        return res.status(500).send({message: ex.message});
    }

};

delete_post = async (req, res) => {
    let id = req.params.id;
    console.log(`HTTP Request to delete a post with id: ${id}`);

    if (is_id_invalid(res, id)) return res.end();

    let result = undefined;
    // tries to delete the post
    try {
        result = await repository.delete_post_by_id(id);
    } catch (ex) {
        console.log(`Error caught when trying to delete a post. Error: ${ex}`);
        return res.status(500).send({message: ex.message});
    }

    // verifies if post exists
    if (!result) {
        console.log('Post not found, returning 404');
        return res.status(404).send({message: 'Post not found'})
    } else {
        console.log('Post successfully deleted');
        return res.status(200).send(result);
    }
};

update_post = async (req, res) => {
    let id = req.params.id;
    let post = req.body;
    console.log(`HTTP Request to update a post with id: ${id}, and body: ${JSON.stringify(post)}`);

    if (is_id_invalid(res, id)) return res.end();

    if (is_body_invalid(res, post)) return res.end();

    await repository.get_post_by_id(id)
        .catch(() => {
            console.log('No post found, returning 404');
            return res.status(404).send({message: 'Post not found'});
        });

    if (await is_title_duplicated(res, post.title, id)) return res.end();

    // tries to update the post
    try {
        let result = await repository.update_post_by_id(id, post);
        console.log('Post successfully updated');
        res.status(200).send(result);
    } catch (ex) {
        console.log(`Error caught when trying to update a post. Error: ${ex}`);
        return res.status(500).send({message: ex.message});
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

        console.log('Request body with incorrect params, returning 400');
        return res.status(400).send({
            message: 'Incorrect params',
            error_detail: detail
        });
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

        console.log('Duplicated title, returning 400');
        return res.status(400).send({message: 'Duplicated title'});
    }
};

/*
    Verifies if id is valid according to mongoose.
    If valid, returns nothing.
    If not, returns the request's response with 400.
 */
is_id_invalid = (res, id) => {
    if (!repository.is_id_valid(id)) {
        console.log('Invalid id, returning 400');
        return res.status(400).send({message: 'Invalid id'})
    }
};

module.exports = {
    get_all_posts,
    get_post_by_id,
    create_post,
    delete_post,
    update_post
};