const express = require('express');

const app = express();

const authenticateRoutes = require('./routes/authenticate/authenticate_user.router');
const userRoutes = require('./routes/user_profile/user_profile.router');
const assignmentRoutes = require('./routes/assignments/assignments.router');
const assignmentDetailsRoutes = require('./routes/assignmentDetails/assignmentDetails.router');
const imagesRouter = require('./routes/images/images.router');
const carPropertiesRouter = require('./routes/carProperties/carProperties.router')


app.use(express.json()); //allows us to get json from end points

app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/assignmentDetails', assignmentDetailsRoutes);
app.use('/api/v1/auth', authenticateRoutes);
app.use('/api/v1/images', imagesRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/carProperties', carPropertiesRouter)

module.exports = app
 