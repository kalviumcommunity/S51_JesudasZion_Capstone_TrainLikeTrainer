const express = require('express');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cors());
router.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173', // Replace this with the actual origin of your frontend application
  credentials: true // Allow credentials (cookies)
};
router.use(cors(corsOptions));

router.post('/', verifyToken, (req, res) => {
  if (req.user) {
    // If user is authenticated, return user information
    res.json({ authenticated: true, user: req.user });
  } else {
    // If user is not authenticated, return appropriate response
    res.json({ authenticated: false });
  }
});

// Middleware function to verify JWT token
function verifyToken(req, res, next) {
  const encryptedToken = req.body.token;
  console.log(encryptedToken);
  if (!encryptedToken) {
    next();
    return;
  }

  // Decrypt the token
  const secretKey =process.env.SECRET_TOKEN; // Use the same secret key used for encryption
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decryptedToken = decipher.update(encryptedToken, 'hex', 'utf-8');
  decryptedToken += decipher.final('utf-8');

  // Verify the decrypted token
  jwt.verify(decryptedToken, process.env.SECRET_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  });
}

module.exports = router;
