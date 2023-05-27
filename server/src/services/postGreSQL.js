const { Pool } = require('pg');

let pool;

if (process.env.NODE_ENV === 'production') {
    // In production environment (Heroku), use DATABASE_URL
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: true
        }
    });
} else {
    // In development environment (local machine), use local database settings
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'lebot',
        password: 'Opyorick1',
        port: 5432,
        max: 20,
    });
}

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
        console.log('Successfully connected to PostgreSQL database.');
        console.log('Current time in the database:', res.rows[0].now);
    }
});

module.exports = pool;