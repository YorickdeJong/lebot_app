const jwt = require('jsonwebtoken')
const secret = "secret-key"; // your secret key for signing the JWT
const pool = require('../../services/postGreSQL')
const bcrypt = require('bcryptjs');

const {
    authenticateUserQuery,
    authenticateAdminQuery
 } = require('../../services/queries/queryUserProfile')

// Function to generate JWT
function generateToken(userId) {
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

// Function to verify JWT
function verifyToken(token) {
  return jwt.verify(token, secret);
}

const authenticateUser = async (req, res) => {
    const { email, password } = req.body;
    const client = await pool.connect();

    console.log('email', email)
    console.log('password', password)
    try {
        const { rows } = await client.query(authenticateUserQuery, [email]);
        if (rows.length === 0) {
            return res.status(401).send({ error: 'Email incorrect' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({ error: 'Password is incorrect' });
        }

        const id = user.id
        const token = generateToken(user.id);
        const user_role = user.user_role

        console.log(`user token: ${token}`)
        res.json({ 
            message: 'User authenticated',
            token,
            id,
            user_role
        });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'An error occurred while logging in' });
    } 
    finally {
        client.release();
    }
}

const authenticateAdmin = async (req, res) => {
    const { email, password } = req.body;
    const client = await pool.connect();

    console.log(email + " " + password) 
    try {
        const { rows } = await client.query(authenticateAdminQuery, [email]);
        if (rows.length === 0) {
            console.log('incorrect email')
            return res.status(401).send({ error: 'Email is incorrect' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        console.log('ismatch', isMatch)
        if (!isMatch) {
            return res.status(401).send({ error: 'Password is incorrect' });
        }

        const id = user.id
        const token = generateToken(user.id);
        const user_role = user.user_role

        console.log(`user token: ${token}`)
        res.json({ 
            message: 'User authenticated',
            token,
            id,
            user_role
        });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'An error occurred while logging in' });
    } 
    finally {
        client.release();
    }
}

// Middleware to verify JWT
function authenticate(req, res, next) {
  const token = req.headers.authorization;

  try {
      const decoded = verifyToken(token);
      req.userId = decoded.userId;
      next();
  } 
  catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
      authenticateUser,
      authenticate,
      authenticateAdmin
}