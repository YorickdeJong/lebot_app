const express = require('express')
const authenticateRoutes = require('./routes/authenticate/authenticate_user.router')
const userRoutes = require('./routes/user_profile/user_profile.router')
const assignmentRoutes = require('./routes/assignments/assignments.router.js')
const app = express();

app.get('api/v1/users', (req, res) => {
    res.send('hello')
})

app.use(express.json()); //allows us to get json from end points

app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/auth', authenticateRoutes);
app.use('/api/v1/users', userRoutes)
module.exports = app
 