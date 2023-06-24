const io = require("socket.io");
const users = require("./users");

/**
 * The function initializes a socket connection and handles events related to user creation, call
 * requests, call initiation, call ending, and disconnection.
 * @param socket - The socket parameter is an instance of a socket connection between the server and a
 * client. It allows for real-time communication between the two.
 */
function initSocket(socket) {
  let id;
  socket
    .on("init", async () => {
      id = await users.create(socket);
      if (id) {
        socket.emit("init", { id });
      } else {
        socket.emit("error", { message: "Failed to generating user id" });
      }
    })
    .on("request", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("request", { from: id });
      }
    })
    .on("call", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("call", { ...data, from: id });
      } else {
        socket.emit("failed");
      }
    })
    .on("end", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("end");
      }
    })
    .on("disconnect", () => {
      users.remove(id);
      console.log(id, "disconnected");
    });
}

/* This code exports a function that creates a socket.io server instance and listens for connections on
the provided `server` parameter. The server is configured to use the path "/bridge" and not serve
the client-side socket.io library. When a connection is established, the `initSocket` function is
called to handle events related to user creation, call requests, call initiation, call ending, and
disconnection. */
module.exports = (server) => {
  io({ path: "/bridge", serveClient: false })
    .listen(server, { log: true })
    .on("connection", initSocket);
};
