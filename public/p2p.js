var generated_id = random_string(5)

var peer = new Peer(generated_id);

let myIdElement = document.getElementById('my_id').innerText = generated_id


peer.on('open', function(id) {
    console.log('Connected. My peer ID is: ' + id);
  });

peer.on('connection', function(conn) {
    console.log("New peer connected: "+conn)
});


document.getElementById("start-btn").addEventListener("click", () => {
    socket.emit("newPlayer", "");
    console.log(players)
    if(players == 1) {
        player = "black"
    }
    chess.resize()
    joinButton.remove()
  });


let touchStartDistance = 0;
let currentSize = chess.size;

document.addEventListener('touchstart', (e) => {
if (e.touches.length === 2) {
    currentSize = chess.size;
    touchStartDistance = getDistanceBetweenTouches(e.touches[0], e.touches[1]);
}
});

document.addEventListener('touchmove', (e) => {
if (e.touches.length === 2) {
    const touchMoveDistance = getDistanceBetweenTouches(e.touches[0], e.touches[1]);
    const pinchSpreadDistance = touchMoveDistance - touchStartDistance;
    chess.size = currentSize+pinchSpreadDistance
    chess.resize()
}
});

function getDistanceBetweenTouches(touch1, touch2) {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
}


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



function random_string(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUBWXYZAAAAEEEEIIIIOOOOUUUU';
    
    for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
    }
    return result;
}