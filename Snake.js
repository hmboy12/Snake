//Creating the boxsize for each block in the canvas
var boxsize = 25;
var rows = 20;
var colums = 20;
var board;
var context;

//Creating the snake head
var snakeX = boxsize*5;
var snakeY = boxsize*5;

//Give the snake speed
var velocityX = 0;
var velocityY = 0;

//Slangens krob
var snakeBody = [];

//Create the food 
var foodX;
var foodY; 
var gameOver = false;


const overlay = document.getElementById("overlay");



//Variable der skal afgøre om der skal lyttes efter brugerimput
let isActive = true;

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * boxsize;
    board.width = colums * boxsize;
    context = board.getContext("2d"); //This is used for drawing on the board

    placeFoodRandom();
    document.addEventListener("keydown", changeDirection);
    setInterval(update, 100); //Updatere 10 gane i sekundet
    const score = document.getElementById("score")

    const restartknap = document.getElementById("RestartButton");
    restartknap.addEventListener("click", restartGame);
    
}

function restartGame() {
    window.location.reload();
}

function update() {
    //Tjekker om spillet er tabt 
    if(gameOver){
        return;
    }

    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height); 
    //Nu skaber vi det første food/æble
    context.fillStyle="red";
    context.fillRect(foodX, foodY, boxsize, boxsize);

    //Tjekker om slangen er ovenpå æblet og placere et nyt æble samt forlænger kroppen med en
    if(snakeX===foodX && snakeY===foodY) {
        snakeBody.push([foodX, foodY]);
        placeFoodRandom();
    }

    for(let i= snakeBody.length-1; i>0; i--) {
        snakeBody[i] = snakeBody [i-1];
    }

    if(snakeBody.length){
        snakeBody[0]=[snakeX, snakeY];
    }

    //Vi starter fra hjørnet i vores canvas 0,0 og vi fylder det ud til 25*25 og maler det sort
    //Nu skaber vi hovedet i vores canvas. Vi siger at vi skal farve den firkant vi har valgt som er (snakeX, snakeY) til og med (boxsize, boxsize)
    //hvilket jo giver god mening da den så starter i den i de pixelst vi vil have og præcist farver en box
    context.fillStyle="blue";
    snakeX += velocityX*boxsize;
    snakeY += velocityY*boxsize;
    context.fillRect(snakeX, snakeY, boxsize, boxsize);
    for(let i=0; i<snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1], boxsize, boxsize);
    }

    //Game over betingelser
    if(snakeX <0  || snakeX >= colums*boxsize) {
        gameOver = true;
        const modal = document.getElementById("modal");
        openModal(modal);
    }

    else if(snakeY <0 || snakeY >= rows*boxsize){
        gameOver = true;
        const modal = document.getElementById("modal");
        openModal(modal);
    }

    for(let i=0; i< snakeBody.length; i++) {
        if(snakeX==snakeBody[i][0] && snakeY==snakeBody[i][1]) {
            gameOver=true;
            const modalB = document.getElementById("modalB")
            openModal(modalB);
        }
    }
    score.textContent = "Score: " +  getSnakeSize();
}

function openModal(modal) {
    modal.classList.add('active');
    overlay.classList.add('active');
}
function closeModal(modal) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
}


//Vi skaber en function til at placere et æble random 

function placeFoodRandom() {
    //Vi vil tjekke om æblet er oven i slangen når det tilfældigt placeres
    var noSnake = false;
    var posibleFoodX;
    var posibleFoodY;
    var isPosibleFoodXAndYOnSnake;
    //Så længe at æblet placeres på slangen skal while loopet køre fordi så skal vi blive ved med at skabe bud på hvor æblet kan placeres
    while(!noSnake) {
        //I starten af while løkken skal isPosibleFoodXAndYOnSnake altid være false
        isPosibleFoodXAndYOnSnake = false;
        //Skaber nu en tilfældig placering
        posibleFoodX = Math.floor(Math.random()*colums)*boxsize
        posibleFoodY = Math.floor(Math.random()*rows)*boxsize;
        //Tjekker om den placering rammer slangens krop
        //Hvis æblet på en af sammenligningerne rammer kroppen sættes isPosibleFoodXAndYOnSnake 
        //til true hvilket gør at noSnake ikke sættes til true men forbliver false så while loopet køre igen
        for(let i=0; i<snakeBody.length; i++) {
            if(posibleFoodX==snakeBody[i][0] && posibleFoodY==snakeBody[i][1]){
                isPosibleFoodXAndYOnSnake = true;
            } 
        }
        //Vi mangler lige og tjekke at æblet ikke spawner oven i slangens hoved. Vi har nemlig kun tjekket om den spawner oven i slangens krop.
        if(posibleFoodX==snakeX && posibleFoodY==snakeY) {
            isPosibleFoodXAndYOnSnake = true;
        }

        //Her sættes noSnake til true hvis æblet ikke er placeret på slangen. Når noSnake bliver true vil ende while løkken og sætte foodX og foodY til de posible værdier og dermed 
        //skabe æblet
        if(!isPosibleFoodXAndYOnSnake){
            noSnake = true;
        }
    }
    foodX = posibleFoodX;
    foodY = posibleFoodY;
}

function changeDirection(e) {
    if(!isActive){
        //Skulle gerne stoppe functionen fra at gøre noget hvis der ikke lyttes efter brugerinput
        return;
    }

    if(e.code == "ArrowUp" && velocityY !=1) {
        velocityX = 0;
        velocityY = -1;
    }

    else if(e.code == "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    }

    else if(e.code == "ArrowLeft" && velocityX !=1) {
        velocityX = -1;
        velocityY = 0;
    }

    else if(e.code == "ArrowRight" && velocityX !=-1) {
        velocityX = 1;
        velocityY = 0;
    }

    isActive = false;
    setTimeout(() => {
        isActive = true;
    }, 100)

    
}

function getSnakeSize() {
    return snakeBody.length +1;
}






