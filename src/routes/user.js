const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();

// Create a new User
router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login route
router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Logout Route
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

// Logout from all sessions route
router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send();
    }
});

// Get current User
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user);
});

// Quety single User
// router.get("/users/:id", auth, async (req, res) => {
//     // id is a Route Parameter (Provided by Express) stored in req.params

//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) res.status(404).send();
//         res.status(200).send(user);
//     } catch (err) {
//         console.log(err);
//     }
// });

// Update a User
router.patch("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];

    const isValidOperation = updates.every(update =>
        allowedUpdates.includes(update)
    );

    if (!isValidOperation)
        return res.status(400).send({ error: "Invalid updateds!!" });

    try {
        updates.forEach(update => (req.user[update] = req.body[update]));
        await req.user.save();
        res.status(200).send(req.user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete a User
router.delete("/users/me", auth, async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).send(req.user);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
