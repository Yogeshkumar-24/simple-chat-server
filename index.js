import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
const app = express()
import dotenv from 'dotenv'

const port = process.env.PORT || 8800;

dotenv.config()
app.options('*', cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://simple-chat-client.vercel.app');
  next();
});

app.use(cors({
    origin: 'https://simple-chat-client.vercel.app',
    methods: ['GET', 'POST']
  }));




const server = http.createServer(app)

const io = new Server(server, {
    cors: {
      origin: 'https://simple-chat-client.vercel.app',
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  });


io.on("connection",(socket)=>{
    console.log(`User Connected ${socket.id}`)


    socket.on("join_room",(data)=> {
        socket.join(data)
        console.log(`User with id: ${socket.id} Joined the Room ${data}`)
    })

    socket.on("send_message",(data)=> {
        socket.to(data.room).emit("receive_message",data)
    })

    socket.on("disconnect",()=>{
        console.log("User",socket.id,"Disconnected")
    })
})


server.listen(port,()=> {
    console.log("Server Started")
})