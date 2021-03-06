document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreDisplay = document.querySelector('#score');
    const startBtn = document.querySelector('#start-button');
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    const colors = [
        '#FFBE0B', //lTetromino
        '#FB5607', //oTetromino
        '#FF006E', //zTetromino
        '#8338EC', //tTetromino
        '#3A86FF' //iTetromino
    ];
  
/* The Tetrominoes - this is created through the grid I have made on Google sheets. 
The array is pulling the position from the numbers I have assigned to each block, represented through the 200 divs in the HTML file */

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [width*2, width*2+1, width+1, 1],
        [width, width*2, width*2+1, width*2+2]
    ];

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ];

    const zTetromino = [
        [width, width+1, width*2+1, width*2+2],
        [1, width, width+1, width*2],
        [width, width+1, width*2+1, width*2+2],
        [1, width, width+1, width*2]
    ];

    const tTetromino = [
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1],
        [width*2, width*2+1, width+1, width+2],
        [0, width, width+1, width*2+1]
    ];

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ];

    const theTetrominoes = [lTetromino, oTetromino, tTetromino, zTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

//randomly selects a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);

    let current = theTetrominoes[random][currentRotation];

    const draw = () => {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            //this adds the color
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    };

    const undraw = () => {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            //this removes the color
            squares[currentPosition + index].style.backgroundColor = ''
        })
    };

    const control = (e) => {
        if(e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    };

    document.addEventListener('keyup', control);

    const moveDown = () => {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    };

//stops the tetromino at the bottom of the grid e.g. freezing it in to place
    const freeze = () => {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            // start a new tetromino falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random () * theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    };

//moves the tetromino left, unless is at the edge or there is a blockage
    const moveLeft = () => {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

        if(!isAtLeftEdge) {
            currentPosition -=1;
        };
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition +=1
        };

        draw();
    };

//move the tetromino right, unless is at the edge or there is a blockage. 
    const moveRight = () => {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1);

        if(!isAtRightEdge) {
            currentPosition +=1;
        };
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition =-1;
        };

        draw();
    };

    const rotate = () => {
        undraw();
        currentRotation ++ ;
        if(currentRotation === current.length) { 
            currentRotation = 0;
        };
        current = theTetrominoes[random][currentRotation];
        draw();
    }

//show the 'up-next' tetromino in mini-grid display. The displayWidth is taken from the width of the mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    const displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [displayWidth, displayWidth+1, displayWidth*2+1, displayWidth*2+2], //zTetromino
        [displayWidth*2, displayWidth*2+1, displayWidth+1, displayWidth+2], //tTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]

//display the shape in the mini-grid display
    const displayShape = () => {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            //this removes the color
            square.style.backgroundColor = '';
        });

        //adds the next tetromino shape
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        });
    }

    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
    });
 
    const addScore = () => {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    //removes the color
                    squares[index].style.backgroundColor = '';
                })
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    const gameOver = () => {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over!';
            clearInterval(timerId);
        }
    }
}) ;




  
  




