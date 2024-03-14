const express = require("express");
require("dotenv").config();

const app = express();

// Home Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Starting the server with error handling
const server = app.listen(process.env.API_PORT, () => {
  const port = server.address().port;
  console.log(`\x1b[32m|| Server is Running on Port ${port} ||\x1b[0m`);
});

console.log(server)
// Error handling for server setup
server.on("error", (error) => {
  console.error("Server setup error:", error);
});
