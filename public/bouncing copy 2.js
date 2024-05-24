// Get a reference to the canvas container div
var canvasContainer = document.getElementById("canvasContainer");

// Create a new canvas element
var canvas = document.createElement("canvas");

// Set the canvas size to match the container size
canvas.width = canvasContainer.offsetWidth;
canvas.height = canvasContainer.offsetHeight;

// Append the canvas to the container
canvasContainer.appendChild(canvas);

// Create a stage on the canvas
var stage = new createjs.Stage(canvas);

// Colors
const white = "#FFFFFF";
const black = "#000000";
const blue = "#000066";
const red = "#660000";
const yellow = "006666"
const green = "006600"

const gray1 = "#111111";
const gray2 = "#222222";
const gray6 = "#666666";

// Player class

/*
                                                                                                         
        █ █████████o   █ ████                  .█.   `█.`████.      ,█' █ ██████████   █ █████████o.             
        █ ████    `██. █ ████                 .███.   `█.`████.    ,█'  █ ████         █ ████    `██.            
        █ ████     `██ █ ████                :█████.   `█.`████.  ,█'   █ ████         █ ████     `██            
        █ ████     ,██ █ ████               . `█████.   `█.`████.,█'    █ ████         █ ████     ,██            
        █ ████.   ,██' █ ████              .█. `█████.   `█.`█████'     █ ████████████ █ ████.   ,██'            
        █ ██████████'  █ ████             .█`█. `█████.   `█. ████      █ ████         █ █████████P'             
        █ ████         █ ████            .█' `█. `█████.   `█ ████      █ ████         █ ████`█b                 
        █ ████         █ ████           .█'   `█. `█████.   █ ████      █ ████         █ ████ `█b.               
        █ ████         █ ████          .█████████. `█████.  █ ████      █ ████         █ ████   `█b.             
        █ ████         █ ████████████ .█'       `█. `█████. █ ████      █ ████████████ █ ████     `██.           
*/
class Player {
    constructor(x, y, radius, color,controlKeys,id) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.glowColor = color;
        this.ballColor = white;
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = 0.5;
        this.bounceFactor = 0.7;
        this.animationSpeed = 0.05;
        this.time = 0;
        this.animFactor = 0;
        this.playing = false
        this.score = 0
        this.controlKeys = controlKeys
        this.id = id
        this.alive = true
        this.keys = {}
    }

    animate(min, max) {

        // Use a sine function to create a smoother animation
        if(this.alive){
            return min + (Math.sin(this.time) * 0.5 + 0.5) * (max - min);
        }
        else{return 1}
    }
    
    update(d) {
        this.speedY += this.gravity;

        // Update position based on speed
        this.x += this.speedX*d;
        this.y += this.speedY*d;

        // Collision checks and adjustments
        if (this.x < this.radius) {
            this.speedX = Math.abs(this.speedX) * this.bounceFactor;
            this.x = this.radius;
        }
        if (this.x > canvas.width - this.radius) {
            this.speedX = -Math.abs(this.speedX) * this.bounceFactor;
            this.x = canvas.width - this.radius;
        }

        if (this.y < this.radius) {
            this.speedY = Math.abs(this.speedY) * this.bounceFactor;
            this.y = this.radius;
        }
        if (this.y > canvas.height - this.radius) {
            this.speedY = -Math.abs(this.speedY) * this.bounceFactor;
            this.y = canvas.height - this.radius;
        }

    }

    draw() {
        const circle = new createjs.Shape();
        if(this.animFactor<1){
            this.animFactor += 0.05
        }
        if(players.length>1){
            circle.graphics.beginFill(this.glowColor).drawCircle(this.x, this.y, this.radius*2*this.animate(0.9, 1.1)*this.animFactor);
            this.time += this.animationSpeed;
            if (this.time >= Math.PI * 2){
                this.time=0
            }
        }
        circle.graphics.beginFill( this.alive?white:black ).drawCircle(this.x, this.y, this.radius*this.animate(1.1, 0.9)*this.animFactor);
        stage.addChild(circle);
    }

    controls() {
        //let keys = this.user == 1? pressedKeys : user2PressedKeys

        if(this.alive){
            if (this.keys[this.controlKeys.left]) {
                this.speedX -= 1;
            }
            if (this.keys[this.controlKeys.right]) {
                this.speedX += 1;
            }
            if (this.keys[this.controlKeys.up]) {
                this.speedY -= 1;
            }
            if (this.keys[this.controlKeys.down]) {
                this.speedY += 1;
            }
        }
    }
}

/*
                                                  
            ,o██████o.     █ █████████o.   █ █████████o   
         . ████     `██.   █ ████    `██.  █ ████    `██. 
        ,█ ████       `█b  █ ████     `██  █ ████     `██ 
        ██ ████        `█b █ ████     ,██  █ ████     ,██ 
        ██ ████         ██ █ ████.   ,██'  █ ████.   ,██' 
        ██ ████         ██ █ █████████P'   █ ██████████   
        ██ ████        ,█P █ ████`█b       █ ████    `██. 
        `█ ████       ,█P  █ ████ `█b.     █ ████      ██ 
         ` ████     ,██'   █ ████   `█b.   █ ████    ,██' 
            `███████P'     █ ████     `██. █ █████████P   
*/

class Orb {
    constructor(radius, color) {
        this.x = canvas.width / 2 -40;
        this.y = canvas.height / 2 -33;
        this.active = true;
        this.radius = radius;
        this.color = color;
        this.speedX = 0;
        this.speedY = 0;
        this.gravity = 0.5;
        this.bounceFactor = 0.7;
        this.animationSpeed = 0.05;
        this.time = 0;

        this.animFactor = 0
    }

    getRandomPosition(min, max) {
        return Math.random() * (max - min) + min;
    }

    animate(min, max) {
        return min + (Math.sin(this.time) * 0.5 + 0.5) * (max - min);
    }
    
    update() {
        this.speedY += this.gravity;

        // Store the current position before potential collision adjustments
        const oldX = this.x;
        const oldY = this.y;

        // Update position based on speed
        this.x += this.speedX;
        this.y += this.speedY;

        // Collision checks and adjustments
        if (this.x < this.radius) {
            this.speedX = Math.abs(this.speedX) * this.bounceFactor;
            this.x = this.radius;
        }
        if (this.x > canvas.width - this.radius) {
            this.speedX = -Math.abs(this.speedX) * this.bounceFactor;
            this.x = canvas.width - this.radius;
        }

        if (this.y < this.radius) {
            this.speedY = Math.abs(this.speedY) * this.bounceFactor;
            this.y = this.radius;
        }
        if (this.y > canvas.height - this.radius) {
            this.speedY = -Math.abs(this.speedY) * this.bounceFactor;
            this.y = canvas.height - this.radius;
        }

    }


    respawn() {
        this.active = true;
        this.animFactor = 0
        this.x = this.getRandomPosition(this.radius, canvas.width - this.radius);
        this.y = this.getRandomPosition(this.radius, canvas.height - this.radius);
    }

    draw() {
        if (this.active) {
            if(this.animFactor<1){
                this.animFactor += 0.05
            }
            const circle = new createjs.Shape();
            circle.graphics.beginFill(gray1).drawCircle(this.x, this.y, this.radius*1.8*this.animate(0.8, 1.5)*this.animFactor);
            circle.graphics.beginFill(gray2).drawCircle(this.x, this.y, this.radius*1.5*this.animate(0.8, 1.3)*this.animFactor);
            circle.graphics.beginFill(gray6).drawCircle(this.x, this.y, this.radius*this.animate(0.8, 1.2)*this.animFactor);
            circle.graphics.beginFill(this.color).drawCircle(this.x, this.y, (this.radius/2)*this.animate(1.1, 0.9)*this.animFactor);
            stage.addChild(circle);
            this.time += this.animationSpeed;
            if (this.time >= Math.PI * 2){
                this.time=0
            }
        }
    }

}

/*
        ███████  ██████  ██████  ██████  ███████ ██████   ██████   █████  ██████  ██████  
        ██      ██      ██    ██ ██   ██ ██      ██   ██ ██    ██ ██   ██ ██   ██ ██   ██ 
        ███████ ██      ██    ██ ██████  █████   ██████  ██    ██ ███████ ██████  ██   ██ 
             ██ ██      ██    ██ ██   ██ ██      ██   ██ ██    ██ ██   ██ ██   ██ ██   ██ 
        ███████  ██████  ██████  ██   ██ ███████ ██████   ██████  ██   ██ ██   ██ ██████  
                                                                                          
                                                                                          
*/
class ScoreBoard{
    constructor(){
        this.x = canvas.width / 2;
        this.y = 20;
        this.redSide = 0.5
        this.blueSide = 0.5
        this.pos = 0
        this.barSize = canvas.width / 2-40
        this.barBits = this.barSize/maxScore
        this.animFactor = 0

    }
    drawBar(){
        
        let points = player1.score - player2.score

        let redBarSize = this.barBits*points+this.barSize

        const p1scoreBar = new createjs.Shape()
        const p2scoreBar = new createjs.Shape()
        p2scoreBar.graphics.beginFill("#000088").drawRect(40,this.y,canvas.width-80,10)
        p1scoreBar.graphics.beginFill("#880000").drawRect(40,this.y,redBarSize,10)
        stage.addChild(p2scoreBar);
        stage.addChild(p1scoreBar);
    }
    drawNumbers(player){


        var scoreText = new createjs.Text(player.score,"172px Arial","#444444")

        if(players.length==1){
            scoreText.x = canvas.width / 2
            scoreText.y = canvas.height /2
        }
        
        else{
            if(this.animFactor<1){
                this.animFactor += 0.01
            }
            if(player.number == 1){
                scoreText = new createjs.Text(player.score,"172px Arial","#443333")
                scoreText.x = (canvas.width / 2)-((canvas.width / 2)*this.animFactor)+ (canvas.width / 4)*this.animFactor
                scoreText.y = (canvas.height /2)
            }
            else if(player.number == 2){
                scoreText = new createjs.Text(player.score,"172px Arial","#333344")
                scoreText.x = (canvas.width / 2)-((canvas.width / 2)*this.animFactor)+(canvas.width / 2 + canvas.width / 4)*this.animFactor
                scoreText.y = (canvas.height /2)
            }

        }

        scoreText.textAlign = "center"
        scoreText.textBaseline = "middle"
        
        stage.addChild(scoreText)
        
    }
}






/*
      ███████                                                   
      █       █    █ █    █  ████  █████ █  ████  █    █  ████  
      █       █    █ ██   █ █    █   █   █ █    █ ██   █ █      
      █████   █    █ █ █  █ █        █   █ █    █ █ █  █  ████  
      █       █    █ █  █ █ █        █   █ █    █ █  █ █      █ 
      █       █    █ █   ██ █    █   █   █ █    █ █   ██ █    █ 
      █        ████  █    █  ████    █   █  ████  █    █  ████  
*/










  /*
      █     █                                                    
      █     █   ██   █████  █   ██   █████  █      ██████  ████  
      █     █  █  █  █    █ █  █  █  █    █ █      █      █      
      █     █ █    █ █    █ █ █    █ █████  █      █████   ████  
       █   █  ██████ █████  █ ██████ █    █ █      █           █ 
        █ █   █    █ █   █  █ █    █ █    █ █      █      █    █ 
         █    █    █ █    █ █ █    █ █████  ██████ ██████  ████  
*/


const socket = io();


let players = [];
let currentPlayer;

colors = [red,blue,yellow,green]

socket.emit("joined");


document.getElementById("start-btn").addEventListener("click", () => {
    let playerId = players.length
    let playerColor = colors[playerId]
    currentPlayer = {x:canvas.width / 4 +canvas.width / 2,y: canvas.height / 2, id:playerId, color: playerColor,keys: {}}

    //currentPlayer = new Player(canvas.width / 4 +canvas.width / 2, canvas.height / 2, 20, red, controls.WASD,players.length);
    socket.emit("newPlayer", currentPlayer);
    console.log("Click")
  });


socket.on("newPlayer", (player) => {
    console.log(player.id+" joined the game")
    let newPlayer = new Player(player.x, player.y, 20, player.color, controls.WASD,player.id)
    players.push(newPlayer);
  });

socket.on("joined", (users) => {
    users.forEach((player, index) => {
      //players.push(new Player(index, player.name, player.pos, player.img));
      let alreadyPlaying = new Player(player.x, player.y, 20, player.color, controls.WASD,player.id)
      players.push(alreadyPlaying)
      console.log(player.id+" was playing");
    });
  });

var maxScore = 5

const controls ={
    Arrows : {
        left: "ArrowLeft",
        right: "ArrowRight",
        up: "ArrowUp",
        down: "ArrowDown"
    },
    WASD : {
        left: "KeyA",
        right: "KeyD",
        up: "KeyW",
        down: "KeyS"
    }
}

var pressedKeys = {}
var user2PressedKeys = {}

// Initialize the game

//const player1 = new Player(canvas.width / 4 +canvas.width / 2, canvas.height / 2, 20, red, controls.WASD,1);
const blackBall = new Orb(30, white);

const scoreBoard = new ScoreBoard()


//player1.speedX = Math.random()*40-20;
//player1.speedY = Math.random()*40-20;

var isPlaying = false


debug = true

const winAudio1 = new Audio("win1.mp3")
const winAudio2 = new Audio("win2.mp3")
const catchSounds = ["waw.mp3","wow.mp3"]

// Touch control variables
let touchStartX = 0;
let touchStartY = 0;
let touchCurrentX = 0;
let touchCurrentY = 0;

var touchdown = false;
var deltaX = 0
var deltaY = 0



//var players = {}

let timeScale = 0.7


canvas.addEventListener("touchstart", function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchCurrentX = event.touches[0].clientX;
    touchCurrentY = event.touches[0].clientY;
    touchdown = true
});

canvas.addEventListener("touchmove", function (event) {
    touchCurrentX = event.touches[0].clientX;
    touchCurrentY = event.touches[0].clientY;

    deltaX = (touchCurrentX - touchStartX) * 0.01;
    deltaY = (touchCurrentY - touchStartY) * 0.01;



    //touchStartX = touchCurrentX;
    //touchStartY = touchCurrentY;
});

canvas.addEventListener("touchend", function () {
    //player1.speedX = 0;
    //player1.speedY = 0;
    touchdown = false
});

window.addEventListener("keydown", function (event) {
    if(currentPlayer){
        pressedKeys[event.code] = true;
        socket.emit('keypress', {
            keys:pressedKeys,
            id:currentPlayer.id
        });
    }
});

window.addEventListener("keyup", function (event) {
    if(currentPlayer){
        delete pressedKeys[event.code];
        socket.emit('keypress', {
            keys:pressedKeys,
            id:currentPlayer.id
        })
    };
});


/*socket.on('newUser', (data) =>{
    players = data["users"]
    id = data["id"]
    //const user = users[id]
    const newPlayer = new Player(canvas.width / 4 +canvas.width / 2, canvas.height / 2, 20, blue, controls.WASD,id)
    players[id]["obj"] = newPlayer
    socket.emit('updatePlayers',players)
})*/


socket.on('update', (data) => {
    data.forEach((player, index) => {
        //players.push(new Player(index, player.name, player.pos, player.img));
        let id = player.id
        let keys = player.keys
        players[id].keys = keys;
        //console.log(player);
      });
  });












/*
                                                                                                                 
                                                                                                                 
             SSSSSSSSSSSSSSS      tttt                                                        tttt           !!! 
           SS███████████████S  ttt███t                                                     ttt███t          !!█!!
          S█████SSSSSS██████S  t█████t                                                     t█████t          !███!
          S█████S     SSSSSSS  t█████t                                                     t█████t          !███!
          S█████S        ttttttt█████ttttttt      aaaaaaaaaaaaa  rrrrr   rrrrrrrrr   ttttttt█████ttttttt    !███!
          S█████S        t█████████████████t      a████████████a r████rrr█████████r  t█████████████████t    !███!
           S████SSSS     t█████████████████t      aaaaaaaaa█████ar█████████████████r t█████████████████t    !███!
            SS██████SSSSStttttt███████tttttt               a████arr██████rrrrr██████rtttttt███████tttttt    !███!
              SSS████████SS    t█████t              aaaaaaa█████a r█████r     r█████r      t█████t          !███!
                 SSSSSS████S   t█████t            aa████████████a r█████r     rrrrrrr      t█████t          !███!
                      S█████S  t█████t           a████aaaa██████a r█████r                  t█████t          !!█!!
                      S█████S  t█████t    tttttta████a    a█████a r█████r                  t█████t    tttttt !!! 
          SSSSSSS     S█████S  t██████tttt█████ta████a    a█████a r█████r                  t██████tttt█████t     
          S██████SSSSSS█████S  tt██████████████ta█████aaaa██████a r█████r                  tt██████████████t !!! 
          S███████████████SS     tt███████████tt a██████████aa███ar█████r                    tt███████████tt!!█!!
           SSSSSSSSSSSSSSS         ttttttttttt    aaaaaaaaaa  aaaarrrrrrr                      ttttttttttt   !!! 
                                                                                                                 
                                                                                                                 
                                                                                                                 
                                                                                                                 
                                                                                                                 
                                                                                                                 
                                                                                                                 
*/





createjs.Ticker.framerate =  30;
createjs.Ticker.on("tick", function (event) {
    const delta = (event.delta/16.67) * timeScale;
    stage.removeAllChildren();

    blackBall.draw()
    for(i=0;i< players.length;i++){

        let player = players[i]
        player.controls();
        player.update(delta);
        player.draw();

        if (blackBall.active) {
            
            const distance = Math.sqrt((player.x - blackBall.x) ** 2 + (player.y - blackBall.y) ** 2);

            if (distance <= player.radius + blackBall.radius) {
                blackBall.respawn();
                //new Audio(catchSounds[i]).play()
                player.score++
            }

        }
        

        /*if(isPlaying){
            scoreBoard.drawNumbers(player)
            if(players.length>1){
                scoreBoard.drawBar()
            }
        }
*/
    }
    /*if (players.length == 1 && (pressedKeys[controls.Arrows.left]||
                                pressedKeys[controls.Arrows.right]||
                                pressedKeys[controls.Arrows.up]||
                                pressedKeys[controls.Arrows.down])){
        newPlayerEntered = true
        player1.score = 0
        players.push(player2)
    }
    if (players.length == 2){
        if(player1.score-player2.score>maxScore){
            player2.alive = false
            winAudio1.play()
        }
        else if(player2.score-player1.score>maxScore){
            player1.alive = false
            winAudio2.play()
        }
    }*/



    stage.update();
 
});