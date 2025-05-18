const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const {sql,poolPromise} =  require('./config/db')

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.status(200).send('Hello World! MS SQL Server is Running')
})

app.listen(PORT,()=>{
    console.log(`Server is running on localhost:${PORT}`)
})