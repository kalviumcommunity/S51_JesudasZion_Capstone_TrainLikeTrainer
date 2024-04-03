const express = require("express");
const { startDatabase, stopDatabase, isConnected } = require('./db');
require("dotenv").config();


const cors = require('cors');

const app = express();
app.use(express.json())


const corsOptions = {
  origin: 'http://localhost:5173', // Replace this with the actual origin of your frontend application
  credentials: true // Allow credentials (cookies)
};
app.use(cors(corsOptions));
// Home Route
app.get("/", (req, res) => {
  res.send(`Welcome and DB is ${isConnected() ? 'connected' : 'disconnected'}`);
});




// Login / sign in Routes ---------------------------------------------------------------------------------------------------------------------------


// Import route handlers
const signupRouter = require('./Routes/signupRoute');
const loginRouter = require('./Routes/loginRoute');
const protected = require("./Routes/protected")
const optVerify = require("./Routes/optVerifyRoute")



// Route handlers
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/protected', protected);
app.use("/optVerify", optVerify)



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


