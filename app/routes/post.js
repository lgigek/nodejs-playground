const router = require('express').Router();
const {get_all_posts, get_post_by_id, create_post, delete_post, update_post} = require('../services/post');


// route that returns all posts
router.get('/', get_all_posts);

// route that returns post by its id
router.get('/:id', get_post_by_id);

// route that creates a new post
router.post('/', create_post);

// route that deletes a post by its id
router.delete('/:id', delete_post);

// route that updates a post by its id
router.put('/:id', update_post);

module.exports = router;