var s;
var f;
var b;

function Snake() {
    this.loseElem = document.getElementById("lose");
    this.score = 0;
    this.scoreElem = document.getElementById("score");
    this.snakeBody = [];
    this.snakeX = b.blockSize * 10;
    this.snakeY = b.blockSize * 10;
    this.velocityX = 0;
    this.velocityY = 0;
    this.snakeColor = "lime";
    this.eyeColor = "black";
    this.increaseScore = () => {
        this.score++;
        this.scoreElem.innerText = this.score;
    }
    this.pause = (isPaused) => {
        if(!isPaused) {
            clearInterval(b.updateInterval);
            this.scoreElem.innerText = "PAUSED"
        }else {
            b.updateInterval = setInterval(b.update, 1000/8);
            this.scoreElem.innerText = this.score;
        }
    }
    this.lose = () => {
        this.score = 0
        this.scoreElem.innerText = this.score;
        this.loseElem.classList.add("active");
        setTimeout(() => this.loseElem.classList.remove("active"), 1000);
    }
}

function Food() {
    this.foodX = 0;
    this.foodY = 0;
    this.foodColor = "red";
    this.placeFood = () => {
        this.foodX = Math.floor(Math.random() * b.cols) * b.blockSize;
        this.foodY = Math.floor(Math.random() * b.rows) * b.blockSize;
    }
}

function Board() {
    this.paused = false;
    this.blockSize = 25;
    this.rows = 20;
    this.cols = 20;
    this.board;
    this.context;
    this.initBoard = () => {
        this.board = document.getElementById("board");
        this.board.height = this.rows * this.blockSize;
        this.board.width = this.cols * this.blockSize;
        this.context = board.getContext("2d");

        s = new Snake();
        f = new Food();
        f.placeFood();
        document.addEventListener('keydown', this.changeDirection);

        this.updateInterval = setInterval(this.update, 1000/8);
    }

    this.changeDirection = (e) => {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                if(s.velocityY == 1) break;
                s.velocityX = 0;
                s.velocityY = -1;
                break;
            case "ArrowDown":
            case "KeyS":
                if(s.velocityY == -1) break;
                s.velocityX = 0;
                s.velocityY = 1;
                break
            case "ArrowLeft":
            case "KeyA":
                if(s.velocityX == 1) break;
                s.velocityX = -1;
                s.velocityY = 0;
                break
            case "ArrowRight":
            case "KeyD":
                if(s.velocityX == -1) break;
                s.velocityX = 1;
                s.velocityY = 0;
                break
            case "Escape":
            case "Space":
                if(!this.paused)
                    s.pause(false)
                else
                    s.pause(true)
                this.paused = !this.paused
            default:
                break;
        }
    }

    this.update = () => {
        //board
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.board.width, this.board.height);

        if (s.snakeX == f.foodX && s.snakeY == f.foodY) {
            s.snakeBody.push([f.foodX, f.foodY]);
            s.increaseScore();
            f.placeFood();
        }

        for(let i = s.snakeBody.length-1; i > 0; i--){
            s.snakeBody[i] = s.snakeBody[i-1];
        }
        if(s.snakeBody.length) {
            s.snakeBody[0] = [s.snakeX, s.snakeY];
        }

        for (let i = s.snakeBody.length - 1; i > 0; i--) {
            if(s.snakeBody[i][0] == f.foodX && s.snakeBody[i][1] == f.foodY) {
                f.placeFood();
            }
        }

        //food
        this.context.fillStyle = f.foodColor;
        this.context.fillRect(f.foodX, f.foodY, this.blockSize, this.blockSize);

        //snake
        s.snakeX += s.velocityX * b.blockSize;
        s.snakeY += s.velocityY * b.blockSize;
        if (s.snakeX < 0 ||
            s.snakeY < 0 ||
            s.snakeX > 475 ||
            s.snakeY > 475)
            { this.lose(); }
        this.context.fillStyle = s.snakeColor;
        this.context.fillRect(s.snakeX, s.snakeY, this.blockSize, this.blockSize);

        //snake eyes
        let eyesize = b.blockSize / 5;
        this.context.fillStyle = s.eyeColor;
        this.context.fillRect(s.snakeX + eyesize, s.snakeY + eyesize, eyesize, eyesize);
        this.context.fillRect(s.snakeX + (eyesize * 3), s.snakeY + eyesize, eyesize, eyesize);


        // snake tail
        this.context.fillStyle = s.snakeColor;
        for(let i = 0; i < s.snakeBody.length; i++) {
            this.context.fillRect(s.snakeBody[i][0], s.snakeBody[i][1], this.blockSize, this.blockSize)
        }
    }

    this.lose = () => {
        clearInterval(this.updateInterval);
        s.lose();
        setTimeout(() => {
            s.snakeX = b.blockSize * 10;
            s.snakeY = b.blockSize * 10;
            this.initBoard();
        }, 1000);
    }
}


window.onload = () => {
    b = new Board();
    b.initBoard();
}