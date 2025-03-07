import protobuf from "protobufjs";
import fetchAndParseSAndP500 from "./sp500.js";

let ws = new WebSocket("wss://streamer.finance.yahoo.com");
// Load the .proto file
const root = await protobuf.load("ticker-data.proto");
const tickers = await fetchAndParseSAndP500();

ws.onopen = function () {
  //Subscribe to the channel
  ws.send(
    JSON.stringify({
      subscribe: tickers,
    })
  );
};

ws.onmessage = function (msg) {
  console.log(decode(msg.data));
};

function decode(msg) {
  let encodedMessage = atob(msg);
  let buffer = new Uint8Array(encodedMessage.length);

  // Fill the buffer with the decoded bytes
  for (let i = 0; i < encodedMessage.length; i++) {
    buffer[i] = encodedMessage.charCodeAt(i);
  }

  // Create a Reader instance with the buffer
  let reader = protobuf.Reader.create(buffer);

  try {
    // Get the message type (replace "YourMessageType" with the actual message name)
    const MessageType = root.lookupType("PricingData");
    // Decode the message
    const message = MessageType.decode(reader);

    return message;
  } catch (error) {
    console.error("Error decoding Protobuf message:", error);
    return null;
  }
}
