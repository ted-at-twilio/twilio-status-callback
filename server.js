const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');

// Create an instance of the Express app
const app = express();

// Create an HTTP server to serve the app and handle WebSocket connections
const server = http.createServer(app);

// Set up socket.io for real-time communication
const io = socketIo(server);

// TCP Port to listen on 
const port = 3090; // ORIG: 3000

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Middleware to parse JSON bodies (needed for Twilio webhook)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let latestData = 'No callback data received yet';

// Handle the POST request from Twilio's callback (status updates)
app.post('/webhook', (req, res) => {
  console.log('Received callback data:', req.body);

  // Update the latest data with the received status callback
  latestData = JSON.stringify(req.body, null, 2);

  // Emit the new data to all connected clients
  io.emit('newData', latestData);

  // Respond to Twilio's webhook
  res.status(200).send('<Response></Response>');
});

// Serve the frontend page
app.get('/', (req, res) => {
  res.render('index', { data: latestData });
});

// Start the server on designated TCP port e.g. 3090
server.listen(port, () => {
  console.log('Server is running on http://localhost:' + port);
});
