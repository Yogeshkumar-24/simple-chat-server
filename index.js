import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
const app = express()
import dotenv from 'dotenv'

const port = process.env.PORT || 8800;

dotenv.config()
app.use( cors());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
      origin: 'https://simple-chat-alpha.vercel.app/',
      methods: ['GET', 'POST']
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