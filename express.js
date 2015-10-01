var express = require('express');
var app = express();
var http = require('http');
var io = require('socket.io');
var bodyParser = require('body-parser');
var path = require('path');

var session = require('./session-share');

app.use(bodyParser.urlencoded({
    extended: true
}));

// see app.use from express manual -- tell the server to serve the current directory static files (to access index.html or socket.io.js)
app.use(express.static(path.resolve(__dirname, 'public'))); 

// see app.use from express manual -- tell the server to create the session when the user authenticate themselves
app.use('/authenticate', session); 
app.get('/authenticate', function(req, res) {
    var session = req.session;
    session.userdata = session.userdata || {};
    session.userdata.connected = true;
    session.save(function(err) {
        if (err) {
            connectionError(res, session);
        } else {
            res.status(200);
            res.send();
        }
    });
});

// routes
app.get('/', function(req, res) {
    res.send('welcome');
});

// setup servers
var server = http.createServer(app);
server.listen(3000);