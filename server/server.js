const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;

//Set root folder for server
const publicPath = path.join(__dirname, './../public');

var app = express();

app.use(express.static(publicPath));

app.get('/', (req,res) => {
	res.send(index.html);
});

app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});
