export function privateChat(io) {
  io.on("connection", (socket) => {
    socket.on("join-chat", (params) => {
      socket.join(params.sender);
      socket.join(params.receiver);
    });
    socket.on("start-typing", (data) => {
      io.to(data.receiver).emit("is-typing", data);
    });
    socket.on("stop-typing", (data) => {
      io.to(data.receiver).emit("stoped-typing", data);
    });
  });
}
