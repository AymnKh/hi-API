export function createSocketStream(io) { 
    io.on("connection", (socket) => {
        socket.on("reload", (data) => {
            io.emit("reload", data);
        }
        );
    });
 }