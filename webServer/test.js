/* Corey Garvey - Feb 5 2018
*	Tests	*/

const request = require('supertest');
const express = require('express');
const app = express();

app.get('/address/:address', function(req, res) {
	res.status(200);
	res.set('Content-Type', 'application/json');
	res.send({
		address: req.params.address
	});
});

request(app)
  .get('/address/123')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '17')
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
    else { console.log("Working") }
  });