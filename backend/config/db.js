// Modified config/db.js to match your existing structure

const sql = require('mssql');
require('dotenv').config();

// Config for SQL Server using your env variable names
const config = {
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true
    }
};

// Create a connection and export it as a promise
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Connected to database Successfully :D");
        return pool;
    })
    .catch(err => {
        console.log("Database connection failed", err);
        throw err;
    });

// Export both sql and poolPromise
module.exports = {
    sql,
    poolPromise
};