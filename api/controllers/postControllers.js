const Post = require('../models/post');

exports.addPost = async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
            author: req.user._id,
        });

        await post.save();
        res.status(201).json(post);
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong.');
    }
};