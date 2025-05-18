const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {sql ,poolPromise} = require('./db.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`) );

//get all records USING APIS