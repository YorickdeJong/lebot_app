const jwt = require('jsonwebtoken')
const secret = "secret-key"; // your secret key for signing the JWT
const pool = require('../../services/postGreSQL')
const bcrypt = require('bcrypt');

const {
authenticateUserQuery
 } = require('../../services/queries/queryUserProfile')

// Function to generate JWT
function generateToken(userId) {
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

// Function to verify JWT
function verifyToken(token) {
  return jwt.verify(token, secret);
}

const authenticateUser = (req, res) => {
  const { email, password } = req.body;


  pool.query(authenticateUserQuery, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: 'An error occurred while logging in' });
    }

    if (result.rows.length === 0) {
      return res.status(401).send({ error: 'Email or password is incorrect' });
    }

    const user = result.rows[0];
    const id = user.id
    const token = generateToken(user.id);

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: 'An error occurred while logging in' });
      }

      if (!isMatch) {
        return res.status(401).send({ error: 'Email or password is incorrect' });
      }

      res.json({ 
        message: 'User authenticated',
        token,
        id
      });
    });
  });
}

// Middleware to verify JWT
function authenticate(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
      authenticateUser,
      authenticate
}