const express = require("express");
const { startDatabase, stopDatabase, isConnected } = require('./db');
require("dotenv").config();


const app = express();

// Home Route
app.get("/", (req, res) => {
  res.send(`Welcome and DB is ${isConnected() ? 'connected' : 'disconnected'}`);
});

// Starting the server with error handling
const server = app.listen(process.env.API_PORT, async () => {
  const port = server.address().port
  try{
    await startDatabase()
    console.log(`\x1b[32m|| Server is Running on Port ${port} ||\x1b[0m`)
  } catch (err) {
    console.error('Error starting database:', err.message)
    process.exit(1)
}
  
});

// Error handling for server setup
server.on("error", (error) => {
  console.error("Server setup error:", error)
});
