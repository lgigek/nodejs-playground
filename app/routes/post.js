const router = require('express').Router();
const service = require('../service/post');


// route that returns all posts
router.get('/', async (req, res) => {
    console.log(`HTTP Request to get all posts`);
    let courses = await service.get_all_posts();

    console.log('Retrieving all posts');
    res.status(200).send(courses);
});

// route that creates a new post
router.post('/', async (req, res) => {
    let post = req.body;
    console.log(`HTTP Request to create a new post with data: ${JSON.stringify(post)}`);

    // validates if req.body is valid
    let {error} = service.is_a_post(post);
    if (error) {
        // formats the error reason
        let detail = error.details[0].message;
        detail = detail.replace(/"/g, '\'');

        console.log(`Failed to create post. Detail: ${detail}`);

        // returns 400
        return res.status(400).send({
            message: 'Incorrect params',
            error_detail: detail
        });
    }

    // verifies if title is not duplicated
    if (await service.get_by_title(post.title)) {
        console.log('Duplicated title, returning 400');
        return res.status(400).send({message: 'Duplicated post title'});
    }

    // tries to create e new post
    try {
        let result = await service.insert_post(post);

        console.log('Successfully created de post');
        return res.status(200).send(result);
    } catch (ex) {
        console.log(`Error caught when trying to add a new post. Error: ${ex}`)
        return res.status(500).send({message: ex.message});
    }

});

module.exports = router;