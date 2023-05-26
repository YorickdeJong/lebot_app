jest.mock('http', () => ({
    createServer: () => ({
      listen: jest.fn((port, callback) => {
        if (callback) {
          callback();
        }
      })
    })
}));


jest.mock('ssh2', () => ({
    Client: class {}
  }));
  
jest.mock('socket.io', () => () => ({
    on: jest.fn(),
    listen: jest.fn()
}));

jest.mock('./app', () => () => {}); // mock the Express app
  
jest.mock('./routes/ssh/ssh.sockets', () => ({
    listenToClientSSH: jest.fn()
}));

jest.mock('./routes/measurement_results/measurementResults.socket', () => ({
    listenToClientMeasurementResults: jest.fn()
}));

jest.mock('./routes/power_measurement/powerMeasurement.socket', () => ({
    listenToClientPower: jest.fn()
}));

jest.mock('./routes/groups/groups.socket', () => ({
    listenToClientGroups: jest.fn()
}));

jest.mock('./routes/classes/classes.socket', () => ({
    listenToClientClasses: jest.fn()
}));

jest.mock('./routes/user_profile/user_profile.socket', () => ({
    listenToClientUser: jest.fn()
}));

jest.mock('./routes/time_lessons/time_lessons.socket', () => ({
    listenToClientTimeLessons: jest.fn()
}));

jest.mock('./routes/liveChat/liveChat.socket', () => ({
    listenToClientLiveChat: jest.fn()
}));

const startServer = require('./server');
  
describe('server', () => {
    it('should start the server on specified port', () => {
      startServer();
      expect(require('http').createServer().listen).toHaveBeenCalledWith(3001);
    });
});