import io from "socket.io-client";

/* This code is creating a socket.io client instance and connecting it to the server using the
specified path '/bridge'. The resulting socket object can be used to send and receive real-time data
between the client and server. */
const socket = io({ path: "/bridge" });

export default socket;
