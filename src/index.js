const express = require("express");
const cors = require("cors");
require("./db/mongoose");
const User = require("./models/user");
const Task = require("./models/task");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS (for Dev only)
app.use(cors());

// Automatically parse the incoming JSON
app.use(express.json());

// Configure the Routes
app.use(userRouter);
app.use(taskRouter);

app.get("/", (req, res) => {
  res.send("Ping");
});

// Start Listening on PORT
app.listen(PORT, () => {
    console.log("Server is Running on port", PORT);
});

// const jwt = require("jsonwebtoken");

// const myFunc = async () => {
//     const token = jwt.sign({ _id: "abc123" }, "ThisisJWT", {
//         expiresIn: "0.1 seconds"
//     });
//     console.log(token);

//     const data = jwt.verify(token, "ThisisJWT");
//     console.log(data);
// };

// myFunc();
