const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { readdirSync } = require("fs");
const morgan = require('morgan')
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(morgan('dev'))
//routes
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

app.use((err, req, res, next) => {
  if (err) console.log(err.message);
  next()
})

//database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("error connecting to mongodb", err));


///////////////////////// socket io configuration/////////////////////

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
})

let activeUsers = []

io.on("connection", (socket) => {

  // add new use
  socket.on('new-user-add', (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id
      })
    }
    console.log("Connect Users", activeUsers)
    io.emit('get-users', activeUsers)
  })


  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });

  socket.on('disconnect', () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
    console.log("User Disconnected", activeUsers)
    io.emit('get-users', activeUsers)
  });

})


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}..`);
});
