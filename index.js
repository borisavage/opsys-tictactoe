const express = require("express");
const app = express();
const path = require("path");
const http = require("http");

const {Server} = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("")));
let arr = [];
let playing = [];
io.on('connection',(socket)=>{
    socket.on("find", (e)=>{
        console.log("a user connected");
        if(e.name!=null)
            {
                arr.push(e.name);
                if(arr.length >= 2)
                    {
                        let player1obj={
                            p1name:arr[0],
                            p1value:"X",
                            p1move:""
                        }
                        let player2obj={
                            p2name:arr[1],
                            p2value:"O",
                            p2move:""
                        }
                        let obj={
                            p1:player1obj,
                            p2:player2obj,
                            sum: 1
                        }
                        playing.push(obj);
                        arr.splice(0,2);
                        io.emit('find',{allPlayers:playing});
                    }
            }
    })

    socket.on("playing",(e)=>{
        if(e.value == "X")
            {
                let objChange = playing.find(obj=>obj.p1.p1name === e.name);
                objChange.p1.p1move = e.id;
                objChange.sum++;

            }
        else if(e.value == "O")
            {
                let objChange = playing.find(obj=>obj.p2.p2name === e.name);
                objChange.p2.p2move = e.id;
                objChange.sum++;
            }
            io.emit("playing",{allPlayers:playing})
    })
    socket.on("gameOver",(e)=>{
        playing = playing.filter(obj=>obj.p1.p1name !== e.name)
    })
});
// - - - - - - - - - - - - - - - - - - - - - - - - - -
server.listen(3000, () => {
    console.log('Server is running!');
  });
//- - - - - - - - - - - - - - - - - - - - - - - - - - -