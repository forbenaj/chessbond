let infoText = document.getElementById("info")

let joinButton = document.getElementById("start-btn")

let mainMenu = document.getElementById("mainMenu")
let connectedTitle = document.getElementById("connectedTitle")
let introMenu = document.getElementById("introMenu")

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

        this.size = window.innerHeight-50
        
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
        this.resize()
        
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

        let fromElement = this.boardElement.rows[this.selectedPiece.r].cells[this.selectedPiece.c]
        let toElement = this.boardElement.rows[r].cells[c]

        if(fromElement == toElement){
            fromElement.children[1].style.display="none";
            this.selectedPiece = false
            console.log("Same piece")
            return
        }

        let rect1 = fromElement.getBoundingClientRect()
        let rect2 = toElement.getBoundingClientRect()

        let pos = {
            x: rect2.left - rect1.left,
            y: rect2.top - rect1.top,
        }

        fromElement.children[0].style.left = pos.x+"px"
        fromElement.children[0].style.top = pos.y+"px"

        fromElement.addEventListener('transitionend', () => {
            fromElement.children[0].style.left = 0
            fromElement.children[0].style.top = 0

            this.update()
        }, { once: true });

        this.boardState[r][c] = this.boardState[this.selectedPiece.r][this.selectedPiece.c]
        this.boardState[this.selectedPiece.r][this.selectedPiece.c] = false

        fromElement.children[1].style.display="none";

        this.selectedPiece = false

        if(turn == "White") {
            turn = "Black";
        }
        else if(turn == "Black") {
            turn = "White";
        }

        infoText.innerHTML = turn+" moves"
    }
    resize(){
        if(player=="white"){
            this.boardElement.style.right = -(this.size/2)+"px"
        }
        else if(player=="black"){
            this.boardElement.style.left = -(this.size/2)+"px"
        }
        this.boardElement.style.width = this.size+"px"
        this.boardElement.style.height = this.size+"px"
    }
}

let chess = new Chess()


function startGame(){
    document.addEventListener("click",(e)=>{
        row = e.target.getAttribute("r")
        column = e.target.getAttribute("c")
        console.log([row,column])
        let isPiece = chess.boardState[row][column]
        if(chess.selectedPiece){
            conn.send({action: "movePiece", attr: {row:row,column:column}})
            chess.movePiece(row,column)
        }
        else if(isPiece){
            conn.send({action: "selectPiece", attr: {row:row,column:column}})
            chess.selectPiece(row,column)
        }
        console.log(isPiece)
    })

    conn.on("data", function(data){
        if (data.action === 'movePiece') {
            chess.movePiece(data.attr.row,data.attr.column)
        }
        else if (data.action === 'selectPiece') {
            chess.selectPiece(data.attr.row,data.attr.column)
        }
        else if (data.action === 'updateBoard') {
            console.log("board updated")
            chess.boardState = data["state"]
            turn = data["turn"]
            infoText.innerHTML = turn+" moves"
            chess.update()
        }
    })
}


let myIdElement = document.getElementById('my_id')
let idInput = document.getElementById('id-input')

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('uppercaseInput');

    idInput.addEventListener('input', () => {
        idInput.value = idInput.value.toUpperCase();
    });
});

var myself = null
var conn = null

function connectMyself(){
    myself = new Peer(random_string(3));

    myself.on('open', function(id) {
        console.log('Connected. My peer ID is: ' + id);
        myIdElement.innerText = myself.id
      });

    myself.on('connection', function(recievingConn) {
        console.log("New peer connected: "+recievingConn.peer)
        conn = recievingConn
        player = "black"
        conn.on('data', function(data) {
            console.log(conn.peer+': '+ data);
        });
        succesfullyConnected()
    });

    myself.on('error', (err) => {
        if (err.type === 'unavailable-id') {
            console.log('The peer ID is already in use. Generating new');
            connectMyself()
        }
        else if (err.type === 'peer-unavailable') {
            console.log('The peer you\'re trying to connect to doesn\'t exist');
            inputErrorMessage.innerText = "Peer doesn't exist"
        } else {
            console.error('An unexpected error occurred:', err);
        }
        console.log(err.type)
    });
    
}

connectMyself()




function connectToPeer(){
    let friend_id = idInput.value
    if(friend_id==myself.id){
        inputErrorMessage.innerText = "That's yourself!"
        return
    }
    conn = myself.connect(friend_id);

    conn.on('open', function() {
        succesfullyConnected()
        player="white"
        conn.on('data', function(data) {
          console.log(conn.peer+': '+ data);
        });
        
      });

      conn.on('error', (err) => {
       console.log(err.type)
    });
}

function succesfullyConnected(){
    console.log("You connected to "+conn.peer)

    connectedTitle.innerHTML = "Connected to "+conn.peer+"!"
    introMenu.remove()
    mainMenu.addEventListener("click",(e)=>{
        mainMenu.remove()
    })
    
    if(players == 1) {
        player = "black"
    }
    
    chess.resize()

    setTimeout(() => {
        mainMenu.remove()
    }, 2000);
    
    infoText.innerHTML = "White moves"
    chess.update()

    startGame()

}

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


function random_string(length) {
    let result = '';
    //const characters = 'ABCDEFGHIJKLMNOPQRSTUBWXYZAAAAEEEEEIIIIOOOUU';
    //const characters = 'ABCDEFGHIJKLMNOPQRSTUBWXYZ';
    const consonants = 'BDFLMNPRST';
    const vowels = 'AEIOU';

    result += consonants.charAt( Math.floor(Math.random() * consonants.length))
    result += vowels.charAt( Math.floor(Math.random() * vowels.length))
    result += consonants.charAt( Math.floor(Math.random() * consonants.length))
    
    /*for (let i = 0; i < length; i++) {
        const randomInd = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomInd);
    }*/
    return result;
}