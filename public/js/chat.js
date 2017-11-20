//Start connection
var socket = io();

//AutoScroll
function autoscroll() {
	//Selectors
	var messages = jQuery('#message-list');
	var newMessage = messages.children('li:last-child');
	//Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight(); 
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
		console.log('Should Scroll');
	}
};

socket.on('connect', function () {
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	console.log('Connection Refused by server');
});


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

//---Listen to message from server
socket.on('newMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery("#message-template").html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	jQuery("#messages-list").append(html);
	// var formattedTime = moment(message.createdAt).format('h:mm a');
	// var li = jQuery('<li></li>');
	// li.text(`${message.from} ${formattedTime} : ${message.text}`);
	// //Append to previous messages
	// jQuery('#messages-list').append(li);
});

socket.on('newLocationMessage', function (locationMessage) {
	var formattedTime = moment(locationMessage.createdAt).format('h:mm a');
	var template = jQuery("#location-message-template").html();
	var html = Mustache.render(template, {
		url: locationMessage.url,
		from: locationMessage.from,
		createdAt: formattedTime
	});

	jQuery("#messages-list").append(html);
	// var li = jQuery('<li></li>');
	// var a = jQuery('<a target="_blank">My current location</a>');
	// li.text(`${locationMessage.from} ${formattedTime} : `);
	// //Attach location to message
	// a.attr("href", locationMessage.url);
	// //append link to message -> from : link
	// li.append(a);
	// jQuery('#messages-list').append(li);
});
