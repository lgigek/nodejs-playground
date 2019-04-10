const repository = require('../repositories/post');

get_all_posts = async (req, res) => {
    console.log(`HTTP Request to get all posts`);
    let courses = await repository.get_all_posts();

    console.log('Retrieving all posts');
    res.status(200).send(courses);
};

create_post = async (req, res) => {
    let post = req.body;
    console.log(`HTTP Request to create a new post with data: ${JSON.stringify(post)}`);

    // validates if req.body is valid
    let {error} = repository.is_a_post(post);
    if (error) {
        // formats the error reason
        let detail = error.details[0].message;
        detail = detail.replace(/"/g, '\'');

        console.log(`Failed to create post. Detail: ${detail}`);
        return res.status(400).send({
            message: 'Incorrect params',
            error_detail: detail
        });
    }

    // verifies if title is not duplicated
    if (await repository.get_by_title(post.title)) {
        console.log('Duplicated title, returning 400');
        return res.status(400).send({message: 'Duplicated title'});
    }

    // tries to create e new post
    try {
        let result = await repository.insert_post(post);

        console.log('Successfully created de post');
        return res.status(200).send(result);
    } catch (ex) {
        console.log(`Error caught when trying to add a new post. Error: ${ex}`)
        return res.status(500).send({message: ex.message});
    }

};

delete_post = async (req, res) => {
    let id = req.params.id;
    console.log(`HTTP Request do delete a post with id: ${id}`);

    // verifies if id is valid
    if (!repository.is_id_valid(id)) {
        console.log('Invalid id, returning 400');
        return res.status(400).send({message: 'Invalid id'})
    }

    let result = await repository.delete_by_id(id);
    // verifies if post exists
    if (!result) {
        console.log('Post not found, returning 404');
        return res.status(404).send({message: 'Post not found'})
    } else {
        console.log('Post successfully deleted');
        return res.status(200).send(result);
    }
};

module.exports = {
    get_all_posts,
    create_post,
    delete_post
};