import readline from 'readline';

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Create a WebSocket connection
const socket = new WebSocket("ws://localhost:3000");

// Message is received
socket.addEventListener("message", event => {
  // Convert Buffer to string if necessary
  const message = event.data instanceof Buffer ? event.data.toString() : event.data;

  // Log the data
  console.log(`Received: ${message}`);

  // Define a regex pattern for direct messages
  // Assuming the direct message format is something like "@<senderId> <message>"
  const directMessageRegex = /^@(\S+) (.+)$/;

  // Attempt to match the direct message format
  const match = message.match(directMessageRegex);

  if (match) {
    // If it's a direct message, extract senderId and the message
    const senderId = match[1];
    const directMessage = match[2];

    // Log the direct message with the sender's ID
    console.log(`Direct message from ${senderId}: ${directMessage}`);
  } else {
    // If it's not a direct message, log as a normal message
    console.log(message);
  }

  rl.prompt(); // Prompt for the next input
});


// Socket opened
socket.addEventListener("open", event => {
  console.log("Connected to the server.");
  rl.prompt();
});

// Socket closed
socket.addEventListener("close", event => {
  console.log("Disconnected from the server.");
  rl.close();
});

// Error handler
socket.addEventListener("error", event => {
  console.error("An error occurred with the WebSocket.");
});

// Handle the 'line' event
rl.on('line', (line) => {
  // check for bye
  if (line.trim().toLowerCase() === 'bye') {
    // Close the WebSocket connection if the user enters 'bye'
    socket.close();
  } else {
    // Send the message to the server
    socket.send(line);
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
