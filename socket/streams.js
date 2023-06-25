export function createSocketStream(io, User, _) {
  const user = new User();
  io.on("connection", (socket) => {
    socket.on("reload", (data) => {
      io.emit("reload", data);
    });
    socket.on("online", (data) => {
      socket.join(data.room);
      user.addUser(socket.id, data.userId, data.room);
      const onlineUser = user.getUsers(data.room);
      io.emit("onlineUsers", _.uniq(onlineUser));
    });
    socket.on("disconnect", () => {
      const removeUser = user.removeUser(socket.id);
      if (removeUser) {
        let onlineUsers = user.getUsers(removeUser.room);
        onlineUsers = _.uniq(onlineUsers);
        _.remove(onlineUsers, (elem) => elem === removeUser.userId);
        io.emit("onlineUsers", onlineUsers);
      }
    });
  });
}
