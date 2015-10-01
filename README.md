# Purpose

Created to answer http://stackoverflow.com/questions/32636155/how-to-access-save-the-session-data-on-the-authorization-event-in-socket-io-expr/32829159

Explaining how it is possible to share sessions id and data between express and Socket.io when they are accessed on different domains


# Problem

Problem comes from the cross-domain policy which won't let you share the connect.sid Cookie value.

A workaround is :

* serve non-httpOnly session cookies from the host (here for me server.dev). [session-share.js line 14]

* read via JavaScript and send the connect.sid value as a sessionId parameter when connection to socket.io [public/index.html line 35:39]

* when handshaking adding the cookie of `connect.sid=socket.handshake.query.sessionId` to the `socket.handshake.headers.cookie` before reading the handshake with the session middleware [socket.js line 22:26]


# How to Use

You should redirect your machine to have domains `server.dev` to  and `socket.dev` to point to `localhost`

`node server.js`

* launch an express server on port 3000

	* serve files under the `./public` directory

* launch a socket.io server on port 8000

You then access : [http://server.dev:3000](http://server.dev:3000) in your browser

See [Expected Results](#expected-result) to see what you should see in both consoles


It will load `./public/index.html` and load `./public/socket.io.js`

And then :

* If the cookie key connect.sid is not set

	* Client tries to connect to `http://socket.dev:8000` : Connection error : [Not authenticated]

	* Client calls /authenticate : session is generated
		
	* Client tries to connect to `http://socket.dev:8000` with value of connect.sid as sessionId parameter : Connection sucessfull

* If cookie connect.sid is set

	* Client tries to connect to `http://socket.dev:8000` with value of connect.sid as sessionId parameter : Connection sucessfull


# Expected Results

*First Page loading Results*

Client console :
	
```
    Trying to connect to Socket.io server
    ----- Connection error : [Not authenticated]
    Call ./authenticate to create session server side
    Session created
    Trying to connect to Socket.io server
    ----- Connection successful with sessionId [s:Ir9dVPi8wzplPCoeNXAsDlOkhL8AW0gx.wwzUQ2jftntWEc6lRdYqGxRBoszjPtjT4dBW/KjFIXQ]
```

Server console :

```
    User trying to connect to Socket.io
    ----- User has no active session, error
    User trying to connect to Socket.io
    ----- Socket.io connection attempt successful
    Connection
```



*Reload page*

Client console : 

```
    Session cookie Detected
    Trying to connect to Socket.io server
    ----- Connection successful with sessionId [s:Ir9dVPi8wzplPCoeNXAsDlOkhL8AW0gx.wwzUQ2jftntWEc6lRdYqGxRBoszjPtjT4dBW/KjFIXQ]
```

Server console :

```
    User trying to connect to Socket.io
    ----- Socket.io connection attempt successful
    Connection
```
