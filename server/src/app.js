const express = require('express');
const cors = require('cors');
const app = express();

const authenticateRoutes = require('./routes/authenticate/authenticate_user.router');
const userRoutes = require('./routes/user_profile/user_profile.router');
const assignmentRoutes = require('./routes/assignments/assignments.router');
const assignmentDetailsRoutes = require('./routes/assignmentDetails/assignmentDetails.router');
const imagesRouter = require('./routes/measurement_results/measurementResults.router');
const powerImagesRouter = require('./routes/power_measurement/powerMeasurement.router');
const carPropertiesRouter = require('./routes/carProperties/carProperties.router')
const chatgptRouter = require('./routes/chatgpt/chatgpt.router')
const schoolsRouter = require('./routes/schools/schools.router')
const keysRouter = require('./routes/keys/keys.router')
const groupRouter = require('./routes/groups/groups.router')
const groupInfoRouter = require('./routes/groups/groupsInfo.router')
const classRouter = require('./routes/classes/classes.router')
const classInfoRouter = require('./routes/classes/classesInfo.router')
const lessonsTimeRouter = require('./routes/time_lessons/time_lessons.router')

app.use(cors());
app.use(express.json()); //allows us to get json from end points

app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/assignmentDetails', assignmentDetailsRoutes);
app.use('/api/v1/auth', authenticateRoutes);
app.use('/api/v1/measurement-results', imagesRouter);
app.use('/api/v1/power-measurement-results', powerImagesRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/carProperties', carPropertiesRouter);
app.use('/api/v1/chatgpt', chatgptRouter);
app.use('/api/v1/schools', schoolsRouter);
app.use('/api/v1/keys', keysRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/api/v1/groups-info', groupInfoRouter);
app.use('/api/v1/classes', classRouter);
app.use('/api/v1/classes-info', classInfoRouter);
app.use('/api/v1/time-lessons', lessonsTimeRouter);
module.exports = app
