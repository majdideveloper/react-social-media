

const User = require("../models/User");
const bcrypt = require("bcrypt")

const router = require("express").Router()


//update User
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            return res.status(200).json("account has updated");
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        return res.status(403).json("you can update only your account");
    }
});
//delete User
router.delete("/:id", async (req, res) => {
    //if(req.body.userId === req.params.id || req.user.isAdmin ){
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const updateUser = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("account has deleted");


        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        return res.status(403).json("you can delete only your account");
    }
});
// get a user
router.get("/:id", async (req, res) => {
    try {
        const getUser = await User.findById(req.params.id);
        const { password, updatedAt, ...others } = getUser._doc
        return res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }

});
// follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const currentUser = await User.findById(req.body.userId);
            const user = await User.findById(req.params.id);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } });
                res.status(200).json("user has beeen followed");
            } else {
                res.status(403).json("you allready follow this account");
            }

        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can't follow yourself");
    }

});
// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const currentUser = await User.findById(req.body.userId);
            const user = await User.findById(req.params.id);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                res.status(200).json("user has beeen unfollowed");


            } else {
                res.status(403).json("you allready unfollow this account");
            }

        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("you can't unfollow yourself");
    }

});

module.exports = router