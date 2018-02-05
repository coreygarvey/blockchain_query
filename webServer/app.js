/* Corey Garvey - Feb 5 2018
*	Web Server */

const express = require('express');
const app = express();

const apiController = require('./controller');

// Handle other addresses with particular error
app.get('/address/:address', apiController.getUnspentTxs);

app.listen(8080, () => console.log('App listening on port 8080!'))