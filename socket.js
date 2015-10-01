    var express = require('express');
    var app = express();
    var http = require('http');
    var io = require('socket.io');
    var sessionExpress = require('express-session');
    var FileStore = require('session-file-store')(sessionExpress);

    var session = require('./session-share'),
        sessionIdKey = session.sessionKey;

    // setup servers
    var server = http.createServer(app, function (req, res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    });

    server.listen(8000);

    var sio = io(server);
    sio.use(function(socket, accept) {        
        // writing sessionId, sent as parameter, on the socket.handshake cookies
        if (socket.handshake.query.sessionId) {
            var cookies = (socket.handshake.headers.cookie || '').split(';');
            cookies.push(sessionIdKey + '=' + socket.handshake.query.sessionId);
            socket.handshake.headers.cookie = cookies.join(';');
        }
        // tells the system to load the session from socket.handshake
        // usually the session is loaded from req.headers.cookie, but socket req is the handshake
        // and the cookies are situated in socket.handshake.headers.cookie
        session(socket.handshake, {}, function(err) {
            if (err) return accept(err);
            console.log('User trying to connect to Socket.io');
            var session = socket.handshake.session,
                userData = session.userdata || {};

            // is connected and good
            if (!userData || !userData.connected) {
                console.log('----- User has no active session, error');
                accept(new Error('Not authenticated'));
            } else {
                console.log('----- Socket.io connection attempt successful');
                accept(null, session.userid !== null);
            }
        });
    });


    sio.on('connection', function (socket) {
        console.log('Connection');
    });