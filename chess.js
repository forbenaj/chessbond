let joinButton = document.getElementById("start-btn")

let mainMenu = document.getElementById("mainMenu")
let connectedTitle = document.getElementById("connectedTitle")
let introMenu = document.getElementById("introMenu")

let player = "white";
let turn = "White"

let forceFullscreen = true

class Chess{
    constructor(darkColor="#88AA22",lightColor="#EEEECC"){
        this.boardElement = document.createElement("table")
        this.boardElement.id = "board"
        this.boardColor = {
            dark: darkColor,
            light: lightColor
        }
        this.size = window.innerHeight-50
        this.gapPercentage = 10
        this.gap = this.size/2+this.size/8*0.01*this.gapPercentage
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

                cellElement.style.backgroundColor = isDark? this.boardColor.dark : this.boardColor.light
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
        for (let i = 0; i < this.boardElement.rows.length; i++) {
            const row = this.boardElement.rows[i];
            
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
    }
    resize(){
        this.gap = this.size/8*0.01*this.gapPercentage
        if(player=="white"){
            this.boardElement.style.right = -(this.size/2+this.gap)+"px"
        }
        else if(player=="black"){
            this.boardElement.style.left = -(this.size/2+this.gap)+"px"
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
        let isPiece = chess.boardState[row][column]
        if(chess.selectedPiece){
            conn.send({action: "movePiece", attr: {row:row,column:column}})
            chess.movePiece(row,column)
        }
        else if(isPiece){
            conn.send({action: "selectPiece", attr: {row:row,column:column}})
            chess.selectPiece(row,column)
        }
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
    idInput.addEventListener('keypress', (event) => {
        if(event.key === "Enter"){
            joinButton.click()
        }
    })
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
    if(!friend_id){
        inputErrorMessage.innerText = "Insert a peer ID"
        return
    }
    conn = myself.connect(friend_id);

    conn.on('open', function() {
        succesfullyConnected()
        if(forceFullscreen){
            document.documentElement.requestFullscreen();
        }
        player="white"
      });

      conn.on('error', (err) => {
       console.log(err.type)
    });
}

function succesfullyConnected(){
    console.log("You connected to "+conn.peer)
    if(forceFullscreen){
        checkFullscreen()
    }

    connectedTitle.innerHTML = "Connected to "+conn.peer+"!"
    introMenu.remove()
    mainMenu.addEventListener("click",(e)=>{
        mainMenu.remove()
    })
    
    chess.resize()

    setTimeout(() => {
        mainMenu.remove()
    }, 2000);
    
    chess.update()

    startGame()

}

let touchStartDistance = 0;
let startX, startY, endX, endY;
let currentSize = chess.size;
let currentGap = chess.gapPercentage;


document.addEventListener('touchstart', (e) => {
if (e.touches.length === 2) {
    currentSize = chess.size;
    currentGap = chess.gap;
    touchStartDistance = getDistanceBetweenTouches(e.touches[0], e.touches[1]);
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    startX = (touch1.clientX + touch2.clientX) / 2;
    startY = (touch1.clientY + touch2.clientY) / 2;
}
});

document.addEventListener('touchmove', (e) => {
if (e.touches.length === 2) {
    const touchMoveDistance = getDistanceBetweenTouches(e.touches[0], e.touches[1]);
    const pinchSpreadDistance = touchMoveDistance - touchStartDistance;

    let newSize = currentSize+pinchSpreadDistance

    if(newSize < window.screen.height){
        chess.size = currentSize+pinchSpreadDistance
    }

    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    endX = (touch1.clientX + touch2.clientX) / 2;
    endY = (touch1.clientY + touch2.clientY) / 2;
    const distanceX = endX - startX;
    const distanceY = endY - startY;

    let newGap = player == "white"? currentGap+distanceX:currentGap-distanceX

    if(newGap > 0 && newGap < 50){
        chess.gapPercentage = newGap
    }
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

function checkFullscreen() {
    console.log("Checking fullscreen status...")
    if (!document.fullscreenElement) {
        goToFullscreen.style.display = 'flex';
        console.log("Fullscreen off")
    } else {
        goToFullscreen.style.display = 'none';
    }
}

addEventListener("fullscreenchange", (event) => {
    if(forceFullscreen){
        checkFullscreen()
    }
});

function setFixedInterval(callback, interval, times) {
    let count = 0;
    const intervalId = setInterval(() => {
        callback();
        count++;
        if (count >= times) {
            clearInterval(intervalId);
        }
    }, interval);
}
