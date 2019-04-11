const router = require('express').Router();
const {get_all_posts, create_post, delete_post, update_post} = require('../services/post');


// route that returns all posts
router.get('/', get_all_posts);

// route that creates a new post
router.post('/', create_post);

// route that deletes a post
router.delete('/:id', delete_post);

// route that updates a post
router.put('/:id', update_post);

module.exports = router;