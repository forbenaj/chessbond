let players = 0

let color = {
    dark: "#88AA22",
    light: "#EEEECC"
}


class Chess{
    constructor(){
        this.boardElement = document.createElement("table")
        this.boardElement.id = "board"
        
        this.boardState = [
            ['wr', 'wp', false, false, false, false, 'bp', 'br'],
            ['wn', 'wp', false, false, false, false, 'bp', 'bn'],
            ['wb', 'wp', false, false, false, false, 'bp', 'bb'],
            ['wq', 'wp', false, false, false, false, 'bp', 'bq'],
            ['wk', 'wp', false, false, false, false, 'bp', 'bk'],
            ['wb', 'wp', false, false, false, false, 'bp', 'bb'],
            ['wn', 'wp', false, false, false, false, 'bp', 'bn'],
            ['wr', 'wp', false, false, false, false, 'bp', 'br']
    ]
        this.selectedPiece = false;
        this.createBoard()
        
    }
    createBoard(){

        
        for (let i = 0; i < this.boardState.length; i++) {

            let rowElement = document.createElement("tr")
            rowElement.className = "row"

            this.boardElement.appendChild(rowElement)
            
            for (let j = 0; j < this.boardState[i].length; j++) {
                let cellElement = document.createElement("td")

                let isDark = (i+j) % 2 == 0
        
                cellElement.style.backgroundColor = isDark? color.dark : color.light
        
                cellElement.setAttribute("r",i)
                cellElement.setAttribute("c",j)

                let imgElement = document.createElement("img")                
        
                let selectedOverlay = document.createElement("div")
                selectedOverlay.className = "selectedOverlay"
        
                cellElement.appendChild(imgElement)
                cellElement.appendChild(selectedOverlay)

                rowElement.appendChild(cellElement)
            }
        }
        
        document.body.appendChild(this.boardElement)

    }

    update(){
        
        // Loop through each row of the table
        for (let i = 0; i < this.boardElement.rows.length; i++) {
            const row = this.boardElement.rows[i];
            
            // Loop through each cell of the row
            for (let j = 0; j < row.cells.length; j++) {
            const cellElement = row.cells[j];
            const cellState = this.boardState[i][j]

            cellElement.children[0].src = `pieces/${cellState}.png`

            if(cellState[0]=="w"){
                cellElement.children[0].style.transform = "rotate(90deg)"
            }
            else if(cellState[0]=="b"){
                cellElement.children[0].style.transform = "rotate(-90deg)"
            }
            }
        }
    }
    selectPiece(r,c){
        if(!this.selectedPiece){
            this.boardElement.rows[r].cells[c].children[1].style.display="block";
    
            this.selectedPiece = {r:r,c:c}
        }
    }
    movePiece(r,c){
        this.boardState[r][c] = this.boardState[this.selectedPiece.r][this.selectedPiece.c]
        this.boardState[this.selectedPiece.r][this.selectedPiece.c] = false

        this.boardElement.rows[this.selectedPiece.r].cells[this.selectedPiece.c].children[1].style.display="none";
        this.selectedPiece = false
        this.update()
    }
}

let chess = new Chess()

document.addEventListener("click",(e)=>{
    row = e.target.getAttribute("r")
    column = e.target.getAttribute("c")
    console.log([row,column])
    let isPiece = chess.boardState[row][column]
    if(chess.selectedPiece){
        chess.movePiece(row,column)
    }
    else if(isPiece){
        chess.selectPiece(row,column)
    }
    console.log(isPiece)
})

const socket = io();


socket.emit("joined");


document.getElementById("start-btn").addEventListener("click", () => {
    socket.emit("newPlayer", "");
    console.log("Click")
  });


socket.on("newPlayer", (data) => {
    players++;
  });

socket.on("joined", (users) => {
    users.forEach((player, index) => {
      //players.push(new Player(index, player.name, player.pos, player.img));
      let alreadyPlaying = new Player(player.x, player.y, 20, player.color, controls.WASD,player.id)
      players.push(alreadyPlaying)
      console.log(player.id+" was playing");
    });
  });


/*

socket.on('updatePlayer', (data) => {
data.forEach((player, index) => {
    //players.push(new Player(index, player.name, player.pos, player.img));
    let id = player.id
    if(id == currentPlayer.id){}
    else{
        let x = player.x
        let y = player.y
        players[id].x = x;
        players[id].y = y;
        //console.log(player);
    }
    });
});

socket.on('catchBall', (data) =>{
    let id = data.id
    let x = data.x
    let y = data.y
    players[id].score ++;
    blackBall.x = x
    blackBall.y = y

})




createjs.Ticker.framerate =  30;
createjs.Ticker.on("tick", function (event) {
    const delta = (event.delta/16.67) * timeScale;
    stage.removeAllChildren();

    blackBall.draw()
    for(i=0;i< players.length;i++){

        let player = players[i]
        if(player.id==currentPlayer.id){
            player.controls();
            player.update(delta);
            player.draw();

            if (blackBall.active) {
                
                const distance = Math.sqrt((player.x - blackBall.x) ** 2 + (player.y - blackBall.y) ** 2);

                if (distance <= player.radius + blackBall.radius) {
                    blackBall.respawn();
                    socket.emit("catchBall",{
                        x:blackBall.x,
                        y:blackBall.y,
                        id:player.id
                    })
                    //new Audio(catchSounds[i]).play()
                }

            }
            
            socket.emit("updatePlayer", {
                x:player.x,
                y:player.y,
                id:player.id
            });
        }
        else{
            player.draw();
        }

    }


    stage.update();
 
});*/