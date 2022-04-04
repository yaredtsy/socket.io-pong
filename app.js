const server = require("http").createServer();
const PORT = 3000;
const io = require("socket.io")(server, {
  cors: {
    origin: "null",
    methods: ["GET", "POST"],
  },
});
server.listen(PORT);

let readyPlayerCount = 0;

io.on("connection", (socket) => {
  const pongNamespace = io.of("/pong");
  console.log("a user connected");
  let room;
  socket.on("ready", () => {
    room = 'room' + Math.floor(readyPlayerCount / 2);
    socket.join(room);
    readyPlayerCount++;

    if (readyPlayerCount % 2 === 0) {
      pongNamespace.in(room),emit("startGame", socket.id);
      
    }
  });

  socket.on("paddleMove", (paddleData) => {
    socket.to(room).emit("paddleMove", paddleData);
  });

  socket.on("ballMove", (ballData) => {
    socket.to(room).emit("ballMove", ballData);
  });

  socket.on("disconnect", (reason) => {});
});
