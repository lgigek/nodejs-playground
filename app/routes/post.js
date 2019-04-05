const router = require('express').Router();
const service = require('../service/post');


// route that returns all posts
router.get('/', async (req, res) => {
    console.log(`HTTP Request to get all posts`);
    let courses = await service.get_all_posts();

    console.log(`Retrieving all posts: ${courses}`);
    res.status(200).send(courses);
});

// route that creates a new post
router.post('/', async (req, res) => {
    let post = req.body;
    console.log(`HTTP Request to create a new post with data: ${post}`);

    // validates if req.body is valid
    let {error} = service.validate_request_body(post);
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

    // tries to create e new post
    try {
        let result = await service.insert_post(post);
        console.log(`Successfully created de post`);
        // success!
        res.status(200).send(result);
    } catch (ex) {
        // verifies if
        if (ex.name === 'MongoError' && ex.code === 11000) {
            res.status(400);
        } else {
            res.status(500)
        }
        res.send({message: ex.message});
    }

});

module.exports = router;