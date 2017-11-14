//Start connection
var socket = io();
var show = document.getElementById('socket-connection');

socket.on('connect', function () {
	show.innerHTML = 'Connected';
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	show.innerHTML = 'Disconnected';
	console.log('Connection Refused by server');
});

//---Listen to message from server
socket.on('newMessage', function (message) {
	var li = jQuery('<li></li>');
	li.text(`${message.from}: ${message.text}`);
	//Append to previous messages
	jQuery('#messages-list').append(li);
});

socket.on('newLocationMessage', function (locationMessage) {
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');

	li.text(`${locationMessage.from}:`);
	//Attack location to message
	a.attr("href", locationMessage.url);
	//append link to message -> from : link
	li.append(a);
	jQuery('#messages-list').append(li);
})

//Form input handle
jQuery('#message-form').on('submit', function (e) {
	e.preventDefault();
	var messageBox = jQuery('[name=message-box]');

	//Validations
	if (messageBox.val() === '') {
		return;
	}

	socket.emit('createMessage', {
		from: 'USER',
		text: messageBox.val()
	}, function () {
		messageBox.val('');
	});
});

//Send location
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
	if (!navigator.geolocation) {
		alert('Geolocation not supported by your browser');
	} else {

		//Button clicked ---Disable it to act it like fethcing data
		locationButton.attr('disabled', 'disabled').text('Sending');
		
		navigator.geolocation.getCurrentPosition(function (location) {
			locationButton.removeAttr('disabled').text('Send Location');	
			
			socket.emit('createLocationMessage', {
				latitude: location.coords.latitude,
				longitude: location.coords.longitude
			});

		}, function () {
			locationButton.removeAttr('disabled').text('Send Location');
			alert('Unable to fetch location.')
		});
	}
});