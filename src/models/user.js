const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) throw new Error("Age Must be a positive No.");
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Invalid Email");
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password"))
                throw new Error("Password can't contain 'password'");
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "author"
});

// Functions which runs whenever user object is stringified
userSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;

    return userObj;
};

// Generate a new JWT
userSchema.methods.generateAuthToken = async function() {
    // The 'methods' methods are called as Instance methods as they work on the Instances (user) of the model (User)
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "thisisjwt");

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

// Verifying the User Credentials
userSchema.statics.findByCredentials = async (email, password) => {
    // The 'static' Methods are called as Model Methods as they work for the whole model (User)
    const user = await User.findOne({ email });

    if (!user)
        throw new Error({
            error: "Unable to login (Invalid Username or Password)"
        });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
        throw new Error({
            error: "Unable to login (Invalid Username or Password)"
        });

    return user;
};

// Hashing the plain text password before storing it
userSchema.pre("save", async function(next) {
    // We're using a standard function because arrow functions don't work well with 'this' bindings
    const user = this; // 'this' gives us the user we're about to save

    if (user.isModified("password"))
        user.password = await bcrypt.hash(user.password, 8);

    next();
});

// Delete User Tasks when a User is removed
userSchema.pre("remove", async function() {
    const user = this;
    await Task.deleteMany({ author: user._id });
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
