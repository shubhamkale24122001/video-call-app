const express= require('express');
const app= express();

const server= require('http').createServer(app);
const io= require('socket.io')(server);
const {v4: uuid4} = require('uuid');

app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.redirect(`/${uuid4()}`);
});

app.get('/:roomId',(req,res)=>{
    res.render('room',{roomId: req.params.roomId}); //the second paramater is used to pass variables to view file being opened (see geeksforrgeeks description of res.render)
});

io.on('connection',socket=>{
    socket.on('join-room',(roomId, userId)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('disconnect',()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId);
        });
    });
});

server.listen(3000);