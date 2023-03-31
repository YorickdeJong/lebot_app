const express = require('express');
const cors = require('cors');
const app = express();

const authenticateRoutes = require('./routes/authenticate/authenticate_user.router');
const userRoutes = require('./routes/user_profile/user_profile.router');
const assignmentRoutes = require('./routes/assignments/assignments.router');
const assignmentDetailsRoutes = require('./routes/assignmentDetails/assignmentDetails.router');
const imagesRouter = require('./routes/measurement_results/measurementResults.router');
const carPropertiesRouter = require('./routes/carProperties/carProperties.router')
const chatgptRouter = require('./routes/chatgpt/chatgpt.router')

app.use(cors());
app.use(express.json()); //allows us to get json from end points

app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/assignmentDetails', assignmentDetailsRoutes);
app.use('/api/v1/auth', authenticateRoutes);
app.use('/api/v1/measurement-results', imagesRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/carProperties', carPropertiesRouter);
app.use('/api/v1/chatgpt', chatgptRouter);

module.exports = app
 