require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const {Server} = require('socket.io')
const path = require('path')
const static = require('koa-static-router')


const app = express()
//socket.io are start

const http = require('http').createServer(app)
//socket.io area end
//socket.io function start
const io = new Server(http, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message", data)
    })
})
//socket.io function end

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))



//Router Settings
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/dogRouter'))
app.use(static({dir:'docs', router:'/doc/'})) 

//For unit test
app.get('/unitTest', (_, res) => {
    res.json({ message: "Test is passed" })
})

// Connect to MongoDB
const URI = process.env.MONGO_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err =>{
    if(err) throw err;
    console.log('Connected to MongoDB already.')
})



const PORT = process.env.PORT || 5000
http.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})


