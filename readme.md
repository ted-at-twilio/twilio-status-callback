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
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Basic route rendering the EJS template
app.get('/', (req, res) => {
    res.render('index');
});

// Socket.io handling
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Start server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

#### **`views/index.ejs`** (EJS template):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Socket.io Example</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <h1>Welcome to Socket.io Example</h1>
    <script src="/socket.io/socket.io.js"></script>
    <script>
        const socket = io();
        socket.on('connect', () => {
            console.log('Connected to the server!');
        });
    </script>
</body>
</html>
```

#### **`public/style.css`** (CSS for basic styling):
```css
body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-top: 50px;
}
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

## Troubleshooting

- **Cannot connect to ngrok URL?**  
  Make sure ngrok is running and the correct port (`3090`) is forwarded. You may need to restart ngrok if it stops.

- **Server is not responding?**  
  Ensure that your server is running (`npm start`). If there are any errors in the terminal, they should give clues about what's wrong.

- **Twilio/other service is not hitting your local server?**  
  Double-check your ngrok URL and endpoint. Make sure you're using the correct URL and method in your external service.

