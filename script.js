const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// Getting high score from the local storage
let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerText = `High Score: ${highScore}`;    


const changeFoodPosition = () => {
    //Generate random value between 0 - 30 for food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

//Game over alert
const handleGameOver = () => {
    if (score > highScore) {
        highScore = score
    };
    //Clearing timer and reloading page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay");
    location.reload();
}

const changeDirection = (e) => {
    //Changing velocity based on arrow key press
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
}

const initGame = () => {

    if (gameOver) return handleGameOver();
    //Places the food piece and snake head on the playboard in the generated positions
    let htmlMarkup = `<div class="food" style= "grid-area: ${foodY} / ${foodX}"></div>`;

    //Checking if snake gets the food
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); //Pushes food position to snake body array
        score++; //Increment score

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;

    } 

    for (let i = snakeBody.length -1; i > 0; i--) {
        //Shifting forward the valyes of the elements in the snake body one by one
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; //Set's first element of snake body to the current snake position

    //Updates snake's head position based on current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    //Checks if snake has hit the edge of the screen, ends game
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for(let i = 0; i < snakeBody.length; i++) {
        //Adds a div for each part of the snake's body
        htmlMarkup += `<div class="head" style= "grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //Checking if snake head hits the body, sets game over
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        };
    }
    
    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125); //snake speed

document.addEventListener("keydown", changeDirection);