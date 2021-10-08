const mongoose = require("mongoose");

const url = `mongodb://${process.env.DB_URL}:27017/task-manager`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Successfully connected to database"))
  .catch((err) => console.log(err));
