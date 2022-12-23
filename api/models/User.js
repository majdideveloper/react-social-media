
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,

    },
    email: {
        type: String,
        require: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    pictureProfile: {
        type: String,
        default: "",

    },
    coverProfile: {
        type: String,
        default: "",

    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },

},
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    const user = this
  
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
          return next(saltError)
        } else {
          bcrypt.hash(user.password, salt, function(hashError, hash) {
            if (hashError) {
              return next(hashError)
            }
  
            user.password = hash
            next()
          })
        }
      })
    } else {
      return next()
    }
  })
  
  


module.exports = mongoose.model("User", UserSchema);