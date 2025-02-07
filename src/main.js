import './style.css';
import Player from './js/player';
import dom from './js/dom';
import manualPlaceShips from './js/manualPlaceShips';
import randomPlaceShips from './js/randomPlaceShips';

const form = document.querySelector('form');
let player;
let isGameOver = false;

function endGame() {
  if (player.computerBoard.allSunk()) {
    dom.newMessage('Enemy fleet sunk!', ' You win!');
  } else {
    dom.newMessage('Your fleet was sunk!', 'Game over!');
  }

  dom.appendBoards(player.playerBoard, player.computerBoard, 'game over');
  dom.endGame();
}

function playRound(e) {
  e.stopImmediatePropagation();

  const isValidCell =
    e.target.classList.contains('cell') &&
    !e.target.classList.contains('attacked');

  if (isValidCell) {
    const { cell } = e.target.dataset;
    const { size } = player.playerBoard;
    const [row, col] = [Math.floor(cell / size), cell % size];
    const message1 = player.playerMove([row, col]);
    const message2 = player.computerMove();
    dom.newMessage(message1, message2);
    dom.appendBoards(player.playerBoard, player.computerBoard, 'normal play');
  }

  if (player.playerBoard.allSunk() || player.computerBoard.allSunk()) {
    isGameOver = true;
    endGame();
  }
}

function handleEnemyClick(e) {
  if (!isGameOver) {
    playRound(e);
  } else {
    const enemy = document.querySelector('#enemy');
    enemy.removeEventListener('click', handleEnemyClick);
  }
}

function randomize() {
  player = new Player();
  randomPlaceShips(player.playerBoard);
  dom.appendBoards(player.playerBoard, player.computerBoard, 'ship placing');
  dom.shipsPlaced();
}

form.addEventListener('submit', (e) => {
  player = new Player();
  dom.submitName(e);
  manualPlaceShips.place(player);
  const startButton = document.querySelector('.start');
  const randomizeButton = document.querySelector('.randomize');
  randomizeButton.addEventListener('click', randomize);

  startButton.addEventListener('click', () => {
    randomizeButton.classList.add('hidden');
    randomPlaceShips(player.computerBoard);
    dom.appendBoards(player.playerBoard, player.computerBoard, 'normal play');
    dom.newMessage('Fire when ready!', '');
    randomizeButton.removeEventListener('click', randomize);

    const enemy = document.querySelector('#enemy');
    enemy.addEventListener('click', handleEnemyClick);
    startButton.remove();
  });
});
