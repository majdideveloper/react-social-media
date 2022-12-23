const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")


// Register User 
router.post("/register", async (req, res) => {

    try {
        const newUser = await new User(
            {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
        const user = await newUser.save();
        res.status(200).json(user)
    } catch (error) {
     res.status(500).json(error)
    }

});

//Login User

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        console.log(user)
        !user && res.status(404).send("email user not found !!!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).send("password is not correct!!!");


        const {password,...others} = user._doc;
        res.status(200).json(others);

    } catch (err) {
        res.status(500).json(error)
    }


})


module.exports = router