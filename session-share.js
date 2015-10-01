// unique session configuration that will be loaded by express.js and socket.js
var sessionExpress = require('express-session');
var FileStore = require('session-file-store')(sessionExpress);

var name = 'connect.sid'; // can be generated or changed 
var secret = 'keyboard cat'; // shouldn't be used in production. Generate one
var session = sessionExpress({
    secret: secret,
    store: new FileStore(),
    name: name,
    resave: true,
    saveUninitialized: true,
    cookie: { 
        httpOnly: false, // important to allow client to read session cookie with JavaScript
        maxAge: 60 * 60 * 1000
    }
});

session.sessionKey = name; // needed so socket.js knows what key for the sessionId setting in the handshake cookies

module.exports = session;