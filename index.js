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
    //when user clicks search, server gets the message with the name and adds them to the "searching" array (arr)
    socket.on("find", (e)=>{
        console.log("a user connected");
        if(e.name!=null)
            {
                arr.push(e.name);
                //if there are 2 or more players in searching array, set them equal to player 1 and player 2, move them to "playing" and remove from search
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
                        //moves players to playing and emits to socket that they are playing
                        playing.push(obj);
                        arr.splice(0,2);
                        io.emit('find',{allPlayers:playing});
                    }
            }
    })
    //pulls the last move from player and changes the "whos turn" based on that
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
    //gets rid of players from playing array, ending the game
    socket.on("gameOver",(e)=>{
        playing = playing.filter(obj=>obj.p1.p1name !== e.name)
    })
});
// - - - - - - - - - - - - - - - - - - - - - - - - - -
server.listen(3000, () => {
    console.log('Server is running!');
  });
//- - - - - - - - - - - - - - - - - - - - - - - - - - -