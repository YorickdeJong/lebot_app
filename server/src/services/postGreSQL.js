const Pool = require('pg').Pool;

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'login',
    password: 'Opyorick1',
    port: 6000,
}

const pool = new Pool(config);

// Test the connection by querying the database
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Successfully connected to PostgreSQL database:', config.database);
    console.log('Current time in the database:', res.rows[0].now);
  }
});

module.exports = pool