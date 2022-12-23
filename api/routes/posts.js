const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");



// CREATE POST
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const postSave = await newPost.save();
        res.status(200).json(postSave);
    } catch (error) {

    }

});
// UPDATE POST
router.put("/:id", async (req, res) => {
    const postUser = await Post.findById(req.params.id);
    if (postUser.userId === req.body.userId) {
        try {
            const updatePost = await Post.findByIdAndUpdate(req.params.id,
                {
                    $set: req.body,
                });
            res.status(200).json("post is been updated");

        } catch (error) {
            res.status(500).json(error);
        }

    } else {
        res.status(403).json("you can update only your posts ...")
    }
});
// DELETE POST
router.delete("/:id", async (req, res) => {
    const deletePost = await Post.findById(req.params.id);
    if (deletePost.userId === req.body.userId) {
        try {
            const deletePost = await Post.findByIdAndRemove(req.params.id);
            res.status(200).json("post is been delete");

        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("you can delete only your posts ...")
    }

});
// LIKE A POST
router.put("/:id/like", async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("post has been disliked");

        }

    } catch (error) {
        res.status(500).json(error);
    }

   
})

// GET POST
router.get("/:id", async (req, res) => {
    try {
        const getPost = await Post.findById(req.params.id);
        res.status(200).json(getPost);
    } catch (error) {
        res.status(500).json(error);
    }

})
// GET ALL POST FOR USER
router.get("/user/:id", async (req, res) => {
    try {
        const getPosts = await Post.find({userId: req.params.id});
        res.status(200).json(getPosts);
    } catch (error) {
        res.status(500).json(error);
    }

})
// GET TIMELINE OF USER
router.get("/timeline/all", async (req, res)=>{
try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({userId: req.params.id});
    const friendPosts = await Promise.all(
        currentUser.followings.map(friendId=>{
            return  Post.find({userId:friendId});
        })
    );
    res.status(200).json(userPosts.concat(...friendPosts))
} catch (error) {
    
}
});


module.exports = router

