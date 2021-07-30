const express = require("express");
const Task = require("../models/task");
const router = new express.Router();
const auth = require("../middleware/auth");

// Create a new Task
router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        author: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

// List all the Tasks
// GET /tasks/?completed
// GET /tasks/?limit&skip
// GET /tasks/?sortBy=*field*_*order(asc or desc)*
router.get("/tasks", auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) match.completed = req.query.completed === "true";

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split("_");
        sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
    }

    try {
        // const tasks = await Task.find({ author: req.user._id });  <-- Alternate Method
        await req.user
            .populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            })
            .execPopulate();
        res.status(200).send(req.user.tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Query a single Task
router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, author: req.user._id });

        if (!task) res.status(404).send();

        res.status(200).send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update a Single Task
router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const validUpdates = ["description", "completed"];
    const isValidOperation = updates.every(update =>
        validUpdates.includes(update)
    );

    if (!isValidOperation)
        return res.status(400).send({ error: "Invalid Updates" });

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            author: req.user._id
        });

        if (!task) return res.status(404).send();

        updates.forEach(update => (task[update] = req.body[update]));

        task.save();

        res.status(200).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete a Task
router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            author: req.user._id
        });

        if (!task) return res.status(404).send();

        res.status(200).send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
