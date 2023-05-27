const Pool = require('pg').Pool;

const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'lebot',
    password: 'Opyorick1',
    port: 5432,
    max: 20,
}

const pool = new Pool(config);


pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the connection by querying the database
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } 
  else {
    console.log('Successfully connected to PostgreSQL database:', process.env.DB_DATABASE || 'lebot');
    console.log('Current time in the database:', res.rows[0].now);
  }
});


module.exports = pool