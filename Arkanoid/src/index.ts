import { CanvasView } from './views/CanvasView';
import { Ball } from './components/Ball';
import { Brick } from './components/Brick';
import { Paddle } from './components/Paddle';
// Images
import PADDLE_IMAGE from './images/paddle.png';
import BALL_IMAGE from './images/ball.png';
// Level and colors
import {
    PADDLE_SPEED,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    PADDLE_STARTX,
    BALL_SPEED,
    BALL_SIZE,
    BALL_STARTX,
    BALL_STARTY
} from './setup';
// Helpers
import { createBricks } from './helpers';
import { Collision } from './collision';

let gameOver = false
let score = 0

const setGameOver = (view: CanvasView) => {
    view.updateInfo('Game Over!')
    gameOver = false
}

const setGameWin = (view: CanvasView) => {
    view.updateInfo('Game Won!')
    gameOver = false
}

// Keep the game running using requesAnimationFrame and check for collisions to update score and exit the loop
const gameLoop = (view: CanvasView, bricks: Brick[], paddle: Paddle, ball: Ball, collision: Collision) => {
    view.clear()
    view.drawBricks(bricks)
    view.buildGame(paddle)
    view.buildGame(ball)

    //move ball
    ball.moveBall();

    //check boundaries of paddle before moving
    if (
        (paddle.isMovingLeft && paddle.pos.x > 0) || (paddle.isMovingRight && paddle.pos.x < view.canvas.width - paddle.width)
    ) {
        paddle.movePaddle()
    }

    collision.checkBallCollision(ball, paddle, view);
    const collidingBrick = collision.isCollidingBricks(ball, bricks);

    if (collidingBrick) {
        score += 1;
        view.updateScore(score);
    }

    //Game Over when ball leaves playField 
    if(ball.pos.y > view.canvas.height) gameOver = true;
    //If game won, set gameOver and display win
    if(bricks.length === 0) return setGameWin(view)
    //If gameover and don't run the requestAnimationFrame
    if(gameOver) return setGameOver(view);

    requestAnimationFrame(() => gameLoop(view, bricks, paddle, ball, collision))
}

//reset and create new Bricks, Ball, Paddle and Collison objects
const startGame = (view: CanvasView) => {
    console.log({ view })

    //reset
    score = 0;
    view.updateInfo('');
    view.updateScore(0);

    //bricks
    const bricks = createBricks();
    //paddle
    const paddle = new Paddle(PADDLE_SPEED, PADDLE_WIDTH, PADDLE_HEIGHT, { x: PADDLE_STARTX, y: view.canvas.height - PADDLE_HEIGHT - 5 }, PADDLE_IMAGE)
    const collision = new Collision();
    const ball = new Ball(BALL_SPEED, BALL_SIZE, { x: BALL_STARTX, y: BALL_STARTY }, BALL_IMAGE);

    gameLoop(view, bricks, paddle, ball, collision)
}

//Create a new view
const view = new CanvasView('#playField')
view.initStartButton(startGame)
