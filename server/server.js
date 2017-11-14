const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const port = process.env.PORT || 3000;
const { generateMessage, generateLocationMessage } = require('./utils/message');
//Set root folder for server
const publicPath = path.join(__dirname, './../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New User Connected');

	//User connected -> Greet user
	socket.emit('newMessage', generateMessage('Administrator', 'Welcome to chatRoom'));

	//Send to other members informing new member joined
	socket.broadcast.emit('newMessage', generateMessage('Administrator', 'New member joined group'));

	//Listen to event and broadcast it
	socket.on('createMessage', (message, callback) => {
		// TO ALL USERS 
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback();
		// ALL EXCEPT SENDER
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().toString()
		// });
	});

	//User location parsing
	socket.on('createLocationMessage', (location) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', location.latitude, location.longitude));
	});

	socket.on('disconnect', () => {
		console.log('User Disconnected');
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
