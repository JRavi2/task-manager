require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.findByIdAndDelete("5d948a66ad182c1f34653fe5")
//     .then(task => {
//         console.log(task);
//         return Task.countDocuments({ completed: false });
//     })
//     .then(count => console.log(count))
//     .catch(err => console.log(err));

const deleteTaskAndCount = async id => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed: false });
    return count;
};

deleteTaskAndCount("5dbaaac50ad661194cd78dce")
    .then(count => console.log(count))
    .catch(e => console.log(e));
