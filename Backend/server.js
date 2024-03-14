const express = require("express")
require("dotenv").config()
//Creating express application
const app = express()

//Home Route
app.get("/" , (req , res)=>{
    res.send("Hello World")
})

// Starting the server
app.listen(process.env.API_PORT,()=>{
    console.log("\x1b[32m|| Server is Running ||\x1b[0m")
})