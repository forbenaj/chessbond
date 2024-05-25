// Get the table element by its ID
const boardTable = document.getElementById('board');

let color = {
    dark: "#88AA22",
    light: "#EEEECC"
}

// Loop through each row of the table
for (let i = 0; i < boardTable.rows.length; i++) {
    const row = boardTable.rows[i];
    
    // Loop through each cell of the row
    for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];

        let isDark = (i+j) % 2 !== 0//!rowIsEven&&columnIsEven||rowIsEven&&!columnIsEven

        cell.style.backgroundColor = isDark? color.dark : color.light

        cell.setAttribute("r",i)
        cell.setAttribute("c",j)

        let selectedOverlay = document.createElement("div")
        selectedOverlay.className = "selectedOverlay"

        cell.appendChild(selectedOverlay)
    }
}


class Chess{
    constructor(){
        this.boardState = [
            //rook     bishop queen king        night
            ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
            ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'], //pawn
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
            ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
          ];
        this.selectedPiece = false;
          
        
    }
    update(){
        
        // Loop through each row of the table
        for (let i = 0; i < boardTable.rows.length; i++) {
            const row = boardTable.rows[i];
            
            // Loop through each cell of the row
            for (let j = 0; j < row.cells.length; j++) {
            const cell = row.cells[j];
            const cellState = this.boardState[i][j]
            
            cell.style.backgroundImage = cellState? `url('pieces/${cellState}.png')`:"none"
            }
        }
    }
    selectPiece(r,c){
        if(!this.selectedPiece){
            boardTable.rows[r].cells[c].firstChild.style.display="block";
    
            this.selectedPiece = {r:r,c:c}
        }
    }
    movePiece(r,c){
        this.boardState[r][c] = this.boardState[this.selectedPiece.r][this.selectedPiece.c]
        this.boardState[this.selectedPiece.r][this.selectedPiece.c] = false

        boardTable.rows[this.selectedPiece.r].cells[this.selectedPiece.c].firstChild.style.display="none";
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