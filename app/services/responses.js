/*
    This class centralizes the responses;
 */
class Response {
    static all_posts(res, posts) {
        console.log('Retrieving all posts');
        return res.status(200).send(posts);
    }

    static post_found(res, post) {
        console.log('Post found! Returning its content');
        return res.status(200).send(post);
    }

    static post_not_found(res) {
        console.log('No post found, returning 404');
        return res.status(404).send({message: 'Post not found'});
    }

    static post_created(res, post) {
        console.log('Successfully created de post');
        return res.status(201).send(post);
    }

    static post_deleted(res, post) {
        console.log('Post successfully deleted');
        return res.status(200).send(post);
    }

    static post_updated(res, post) {
        console.log('Post successfully updated');
        return res.status(200).send(post);
    }

    static generic_error(res, err) {
        console.log(`Error caught: ${err}`);
        return res.status(500).send({message: err.message});
    }

    static invalid_body(res, detail) {
        console.log('Request body with incorrect params, returning 400');
        return res.status(400).send({
            message: 'Incorrect params',
            error_detail: detail
        });
    }

    static duplicated_title(res) {
        console.log('Duplicated title, returning 400');
        return res.status(400).send({message: 'Duplicated title'});
    }

    static invalid_id(res) {
        console.log('Invalid id, returning 400');
        return res.status(400).send({message: 'Invalid id'})
    }
}

module.exports = Response;