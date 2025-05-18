const sql = require('mssql');

require('dotenv').config()

//config for sql server

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



//create a connection and export it as a promise

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Connected to database Successfully :D");
        return pool;
    })
    .catch(err => {
        console.log("Database connection failed", err)
        throw err;
    });

module.exports = {
    sql,
    poolPromise
};

