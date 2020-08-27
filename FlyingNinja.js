//alert("Welcome to FloppyBlob press the up arrow to move!");

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// images
var bird = new Image();
let bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "images/ninja.png";
bg.src = "images/city.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

// variables
var gap = 85; // distance between the two pipes
var constant;

var bX = 10;
var bY = 150;

// set gravity for blob
var gravity = 1.5;

var score = 0;
var highScore = localStorage.getItem("highScore");

if (highScore !== null) {
    if (score > highScore) {
        localStorage.setItem("highScore", score);
    }
} else {
    localStorage.setItem("highScore", score);
}

// sounds files
var fly = new Audio();
var point = new Audio();
var hit = new Audio();
var backgroundMusic = new Audio();

fly.src = "sounds/fly.mp3";
point.src = "sounds/score.mp3";
hit.src = "sounds/hit03.mp3.flac";
backgroundMusic = "sounds/adventure.mp3";

// presses up key
document.addEventListener("keydown", moveUp);

function moveUp() {
    bY -= 60;
    fly.play();
}


// sleep function 
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// pipe coordinates

var pipe = [];

pipe[0] = {
    x: cvs.width,
    y: 0,
};

// draw the images

function draw() {
    ctx.drawImage(bg, 0, 0);
    //start background music
    //backgroundMusic.play();

    for (var i = 0; i < pipe.length; i++) {
        constant = pipeNorth.height + gap;

        ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

        pipe[i].x--; // move the pipe to the left

        if (pipe[i].x == 125) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height,
            });
        }

        // collision detection

        if (
            (bX + bird.width >= pipe[i].x &&
                bX <= pipe[i].x + pipeNorth.width &&
                (bY <= pipe[i].y + pipeNorth.height ||
                    bY + bird.height >= pipe[i].py + constant)) ||
            bY + bird.height >= cvs.height - fg.height
        ) {
            hit.play();

            sleep(400).then(() => {
                //reload after dying
                location.reload();
            })



        }

        if (pipe[i].x == 5) {
            score++;
            point.play();
            hit.play();
        }


        // check high score


        if (highScore !== null) {
            if (score > highScore) {
                localStorage.setItem("highScore", score);
            }
        } else {
            localStorage.setItem("highScore", score);
        }


    }



    //ctx.drawImage(pipeNorth, 100, 0);
    //ctx.drawImage(pipeSouth, 100, 0 + constant);

    ctx.drawImage(fg, 0, cvs.height - fg.height);

    ctx.drawImage(bird, bX, bY);

    bY += gravity;

    // display current score
    ctx.fillStyle = "#000";
    ctx.font = "22px Arial";
    ctx.fillText("Score : " + score, 10, cvs.height - 20);

    // display high score
    ctx.fillText("High Score : " + highScore, 140, cvs.height - 20);

    requestAnimationFrame(draw);
}

draw();