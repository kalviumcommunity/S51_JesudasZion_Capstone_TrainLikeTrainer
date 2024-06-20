const express = require("express");
const { startDatabase, stopDatabase, isConnected } = require("./db");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(express.json());

// const corsOptions = {
//   origin: "http://localhost:5173", // Replace this with the actual origin of your frontend application
//   credentials: true, // Allow credentials (cookies)
// };
app.use(cors());
// Home Route
app.get("/", (req, res) => {
  res.send(`Welcome and DB is ${isConnected() ? "connected" : "disconnected"}`);
});

// Import route handlers
const signupRouter = require("./Routes/signupRoute");
const loginRouter = require("./Routes/loginRoute");
const protected = require("./Routes/protected");
const optVerify = require("./Routes/optVerifyRoute");
const user = require("./Routes/userRoute");
const mail = require("./Routes/sendMail");
const passChange = require("./Routes/passChange");
const googleSave = require("./Routes/GoogleRoute");
const posts = require("./Routes/post");
const tags = require("./Routes/tags");
const replies = require("./Routes/replies");
const getUser = require("./Routes/getUser");
const getData = require("./Routes/getData");
const mark = require("./Routes/mark");


// Route handlers
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/protected", protected);
app.use("/optVerify", optVerify);
app.use("/user", user);
app.use("/mail", mail);
app.use("/passChange", passChange);
app.use("/googleSave", googleSave);
app.use("/posts", posts);
app.use("/tags", tags);
app.use("/reply", replies);
app.use("/" , getUser)
app.use("/" , getData)
app.use("/mark" , mark)

// Starting the server with error handling
const server = app.listen(process.env.API_PORT, async () => {
  const port = server.address().port;
  try {
    await startDatabase();
    console.log(`\x1b[32m|| Server is Running on Port ${port} ||\x1b[0m`);
  } catch (err) {
    console.error("Error starting database:", err.message);
    process.exit(1);
  }
});

// Error handling for server setup
server.on("error", (error) => {
  console.error("Server setup error:", error);
});
