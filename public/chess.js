let boardContainer = document.getElementById("boardContainer")

let infoText = document.getElementById("info")

let joinButton = document.getElementById("start-btn")

let players = 0

let player = "white";

let turn = "White"

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
        //this.createBoard()
        //this.resize()
        
    }
    createBoard(){
        let jStart = player=="white"?0:4
        let jEnd = player=="white"?4:0
        
        for (let i = 0; i < this.boardState.length; i++) {

            let rowElement = document.createElement("tr")
            rowElement.className = "row"

            this.boardElement.appendChild(rowElement)
            
            for (let j = jStart; j < this.boardState[i].length-jEnd; j++) {
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
        
        boardContainer.appendChild(this.boardElement)

    }

    update(){

        let jStart = player=="white"?0:4
        let jEnd = player=="white"?4:0
        
        // Loop through each row of the table
        for (let i = 0; i < this.boardElement.rows.length; i++) {
            const row = this.boardElement.rows[i];
            
            // Loop through each cell of the row
            for (let j = 0; j < row.cells.length; j++) {
            const cellElement = row.cells[j];
            const cellState = this.boardState[i][j+jStart]

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

        let fromElement = this.boardElement.rows[this.selectedPiece.r].cells[this.selectedPiece.c]
        let toElement = this.boardElement.rows[r].cells[c]

        let rect1 = fromElement.getBoundingClientRect()
        let rect2 = toElement.getBoundingClientRect()

        let transform = {
            x: rect2.left - rect1.left,
            y: rect2.top - rect1.top,
            rotation: this.boardState[this.selectedPiece.r][this.selectedPiece.c][0] == "w"? 90 : -90
        }

        //fromElement.children[0].style.transform=`translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotation}deg)`;

        fromElement.children[0].style.left = transform.x+"px"
        fromElement.children[0].style.top = transform.y+"px"

        fromElement.addEventListener('transitionend', () => {
            fromElement.children[0].style.left = 0
            fromElement.children[0].style.top = 0

            this.update()
        }, { once: true });

        this.boardState[r][c] = this.boardState[this.selectedPiece.r][this.selectedPiece.c]
        this.boardState[this.selectedPiece.r][this.selectedPiece.c] = false

        this.boardElement.rows[this.selectedPiece.r].cells[this.selectedPiece.c].children[1].style.display="none";

        this.selectedPiece = false
        //this.update()
        if(turn == "White") {
            turn = "Black";
        }
        else if(turn == "Black") {
            turn = "White";
        }
        infoText.innerHTML = turn+" moves"
        //socket.emit("updateBoard",{state:this.boardState,turn:turn})
    }
    resize(corner){
        let size = (window.innerHeight-50)
        /*if(corner=="black"){
            this.boardElement.style.right = (size/2)+"px";
        }*/
        this.boardElement.style.width = (size/2)+"px"
        this.boardElement.style.height = size+"px"
    }
}

let chess = new Chess()

document.addEventListener("click",(e)=>{
    row = e.target.getAttribute("r")
    column = e.target.getAttribute("c")
    console.log([row,column])
    let isPiece = chess.boardState[row][column]
    if(chess.selectedPiece){
        //chess.movePiece(row,column)
        socket.emit("movePiece",{row:row,column:column})
    }
    else if(isPiece){
        //chess.selectPiece(row,column)
        socket.emit("selectPiece",{row:row,column:column})
    }
    console.log(isPiece)
})

const socket = io();


socket.emit("joined");


document.getElementById("start-btn").addEventListener("click", () => {
    socket.emit("newPlayer", "");
    console.log(players)
    if(players == 1) {
        player = "black"
    }
    chess.createBoard()
    chess.resize(player)
    joinButton.remove()
  });


socket.on("newPlayer", (data) => {
    players=data;
    if(players == 1){
        infoText.innerHTML = "Waiting for player 2..."
        player = "white"
    }
    else if(players == 2) {
        infoText.innerHTML = "White moves"
        chess.update()
    }
  });

socket.on("joined", (data) => {
    console.log("User joined")
  });

socket.on("movePiece", (data) => {
    chess.movePiece(data.row,data.column)
})

socket.on("selectPiece", (data) => {
    chess.selectPiece(data.row,data.column)
})

socket.on("updateBoard", (data) => {
    console.log("board updated")
    chess.boardState = data["state"]
    turn = data["turn"]
    infoText.innerHTML = turn+" moves"
    chess.update()
})
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