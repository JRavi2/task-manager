require("../src/db/mongoose");
const User = require("../src/models/user");

// User.findByIdAndUpdate("5d8f6e095ec70d1b3c2bf625", { age: 1 })
//     .then(user => {
//         console.log(user);
//         return User.countDocuments({ age: 1 });
//     })
//     .then(count => console.log(count))
//     .catch(err => console.log(err));

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
};

updateAgeAndCount("5d8f6e095ec70d1b3c2bf625", 15)
    .then(count => console.log(count))
    .catch(e => console.log(e));
