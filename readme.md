# Real-Time Node.js Application with Socket.io and Ngrok Tunnel

This is a real-time Node.js application that uses **Socket.io** for bidirectional communication between the client and server, with **Express.js** as the web framework and **EJS** as the templating engine. This project also utilizes **ngrok** to expose the local server to the internet, allowing external services (e.g., Twilio) to send data to your local server.

## Prerequisites

- **Node.js** and **npm**: Make sure you have Node.js and npm installed on your system.
- **ngrok**: You need to have ngrok installed to expose your local server to the web.

### Install Node.js and npm
If you haven't installed Node.js and npm, download and install them from [Node.js official site](https://nodejs.org/) or use the following command for macOS:

```bash
brew install node
```

Verify that Node.js and npm are installed:

```bash
node -v
npm -v
```

### Install ngrok
To install **ngrok**, follow these steps:

1. Download and install **ngrok** from the [official ngrok website](https://ngrok.com/download).
2. Alternatively, install it via Homebrew on macOS:

```bash
brew install ngrok/ngrok/ngrok
```

Verify ngrok installation:

```bash
ngrok version
```

## Project Setup

### 1. Clone or Create the Project

To start from scratch, follow these steps:

1. Create a new directory for your project and navigate to it:

```bash
mkdir my-project
cd my-project
```

2. Initialize a new Node.js project:

```bash
npm init -y
```

This will create a `package.json` file with default settings.

### 2. Install Required Dependencies

Install **express**, **socket.io**, **body-parser**, and **ejs**:

```bash
npm install express socket.io body-parser ejs
```

### 3. Create Project Files

Set up the necessary folder structure:

```bash
mkdir public views
```

Create the following files:

#### **`server.js`** (Main server file):
```javascript
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
const port = 3090; // E.g: 3000 - using 3090 since 3000 is taken by Javascript Voice Client

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
```

#### **`views/index.ejs`** (EJS template):
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Call Status Data</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .message-block {
      padding: 10px;
      margin-bottom: 10px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
      white-space: pre-wrap;  /* Preserve line breaks */
      word-wrap: break-word;  /* Break words if they are too long */
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
      text-align: center;
    }
    button {
      display: block;
      width: 100%;
      padding: 10px;
      background-color: #007BFF;
      color: white;
      font-size: 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
    }
    button:hover {
      background-color: #0056b3;
    }
  </style>
  <script src="https://cdn.socket.io/4.0.0/socket.io.min.js"></script>
  <script>
    // Establish WebSocket connection to the server
    const socket = io();

    // Listen for 'newData' event from the server
    socket.on('newData', function(data) {
      // Create a new message block element
      const messageBlock = document.createElement('div');
      messageBlock.classList.add('message-block');
      messageBlock.textContent = data;  // Set the message text
      
      // Get the container element
      const container = document.getElementById('messages');
      
      // Prepend the new message block to the top of the container
      container.insertBefore(messageBlock, container.firstChild);
      
      // Scroll to the top of the container to show the latest message
      container.scrollTop = 0;
    });

    // Function to clear the message container
    function clearMessages() {
      document.getElementById('messages').innerHTML = '';  // Clear all messages
    }
  </script>
</head>
<body>
  <div class="container">
    <h1>Status Callback Data</h1>

    <!-- Clear Button -->
    <button onclick="clearMessages()">Clear</button>

    <!-- Container for displaying messages as blocks -->
    <div id="messages"></div>

  </div>
</body>
</html>
```

### 4. Start the Server

Run your server locally by executing:

```bash
npm start
```

Your server should now be running on [http://localhost:3090](http://localhost:3090).

## Expose Your Local Server Using ngrok

To expose your local server to the web (so external services can access it, like Twilio or other webhooks), you'll need to use **ngrok**.

1. Open a new terminal window or tab and run ngrok to tunnel the HTTP traffic to your local server:

```bash
ngrok http 3090
```

2. After running the above command, **ngrok** will generate a public URL (e.g., `http://abc123.ngrok.io`).

3. Use the generated **ngrok URL** as the endpoint for any external services that need to send requests to your local application.

#### Example Output from ngrok:
```bash
ngrok by @inconshreveable

Session Status                online
Session Expires               1 hour, 59 minutes
Version                       2.3.40
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://abc123.ngrok.io -> http://localhost:3090
Forwarding                    https://abc123.ngrok.io -> http://localhost:3090
```

### 5. Verify Connectivity

Now that your local server is exposed via ngrok, you should be able to interact with your app in real-time. For example, if you're working with **Twilio**, configure it to send HTTP requests to the ngrok URL (e.g., `http://abc123.ngrok.io/webhook`).

## Sample data

![Screenshot](hhttps://jade-bear-6807.twil.io/assets/statuscallback-readme.png)

## Troubleshooting

- **Cannot connect to ngrok URL?**  
  Make sure ngrok is running and the correct port (`3090`) is forwarded. You may need to restart ngrok if it stops.

- **Server is not responding?**  
  Ensure that your server is running (`npm start`). If there are any errors in the terminal, they should give clues about what's wrong.

- **Twilio/other service is not hitting your local server?**  
  Double-check your ngrok URL and endpoint. Make sure you're using the correct URL and method in your external service.

