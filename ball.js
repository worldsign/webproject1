var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// 공의 설정값
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 5;
var dy = -5;

// 막대기의 설정값
var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;

// 블럭 설정값
var blockRowCount = 5;     //열
var blockColumnCount = 6;  //행
var blockWidth = 75; 
var blockHeight = 20;
var blockPadding = 1;
var blockOffsetTop = 50;
var blockOffsetLeft = 50;




// 게임의 필요 설정값
var score = 0;
var life = 5;
var level = 1;
var gameStart = false;

// 2차원 배열을 이용한 블럭 
var blocks = [];
for (var c = 0; c < blockColumnCount; c++) {
    blocks[c] = [];
    for (var r = 0; r < blockRowCount; r++) {
        blocks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
// 22


// 키 핸들러 
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = true;
    }
    else if (e.keyCode == 37) {
        leftPressed = true;
    }
    else if (e.keyCode == 32){
        gameStart = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 39) {
        rightPressed = false;
    }
    else if (e.keyCode == 37) {
        leftPressed = false;
    }
    if (life <= 0 && e.keyCode == 83) { document.location.reload(); }

}

// 충돌 함수

function collisionBlocks() {
    for (var c = 0; c < blockColumnCount; c++) {
        for (var r = 0; r < blockRowCount; r++) {
            var b = blocks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + blockWidth && y > b.y && y < b.y + blockHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == blockRowCount * blockColumnCount) {    
                        alert("1단계 클리어");
                        gameStart = false;
                        dx = 8;
                        dy = -8;
                        drawblocks2();
                        level++;
                    }
                }
            }
        }
    }
}


function drawBall() {
    
    if(!gameStart){
        x = paddleWidth / 2 + paddleX;
        y = canvas.height-ballRadius*2;
    }
    
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0060DD";
    ctx.fill();
    ctx.closePath();
   
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "yellowgreen";
    ctx.fill();
    ctx.closePath();
}
function drawblocks() {
    for (var c = 0; c < blockColumnCount; c++) {
        for (var r = 0; r < blockRowCount; r++) {
            if (blocks[c][r].status == 1) {
                var blockX = (r * (blockWidth + blockPadding)) + blockOffsetLeft;
                var blockY = (c * (blockHeight + blockPadding)) + blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fillStyle = "rgb(129, 179, 255)";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawblocks2() {

    for (var c = 0; c < blockColumnCount; c++) {
        for (var r = 0; r < blockRowCount; r++) {  
                var b = blocks[c][r];
                b.status = 1;          
                var blockX = (r * (blockWidth + blockPadding)) + blockOffsetLeft;
                var blockY = (c * (blockHeight + blockPadding)) + blockOffsetTop;
                blocks[c][r].x = blockX;
                blocks[c][r].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, blockWidth, blockHeight);
                ctx.fillStyle = "rgb(129, 179, 255)";
                ctx.fill();
                ctx.closePath();            
        }
    }
}


function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}
function drawLife() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Life: " + life, 8, 40);

    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Level: " + level, 410, 20);
}



function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawblocks();
    drawBall();
    drawPaddle();
    collisionBlocks();
    drawScore();
    drawLife();
    
    if(level >= 2)
    {

        paddleWidth = 70;
        paddleHeight = 10;

        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0060DD";
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "yellowgreen";
        ctx.fill();
        ctx.closePath();
    }    

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            life--;
            gameStart = false;

            if (!life) {
                ctx.font = "bold 20px Arial";

                ctx.textAlign = "center";
                ctx.fillText("Game Over", canvas.width / 2 , canvas.height / 2 - 30) ;

                ctx.font = "bold 20px Arial";
                ctx.fillText("Press S to palt again", (canvas.width / 2), (canvas.height / 2));
                ctx.textAlign = "left";

                ctx.font = "bold 20px Arial";
                ctx.fillText("  Your Score : " + score, (canvas.width / 2) - 70, (canvas.height / 2) + 30);
                ctx.textAlign = "center";

                SLEEP(1500);
            }
            else if(level == 2){               
                dx = 8;
                dy = -8;    
            }

            else{
                dx = 5;
                dy = -5;
            }
        }
    }
   

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();

