'use strict';
// Dependencies
const path = require('path');
const express = require('express');
const http = require('http');
const app = express();
const electron = require('electron');

// Set up app to use body parser for json encoding on POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', express.static(path.join(__dirname, '/ion_app/www')));
app.set('view engine', 'html');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

require("./api/routes")(app);

// App start up
http.createServer(app).listen(8080);
console.log('---------------------------------------------------');
console.log('Service running on port: ' + '8080');
console.log('---------------------------------------------------');

module.exports = app;