import './style.css';
import Player from './js/player';
import dom from './js/dom';
import manualPlaceShips from './js/manualPlaceShips';
import randomPlaceShips from './js/randomPlaceShips';

const form = document.querySelector('form');
const enemy = document.querySelector('#enemy');
let player;
let isGameOver = false;

function endGame() {
  if (player.computerBoard.allSunk()) {
    dom.newMessage('Enemy fleet sunk!', ' You win!');
  } else {
    dom.newMessage('Your fleet was sunk!', 'Game over!');
  }

  dom.appendBoards(player.playerBoard, player.computerBoard, 'game over');
  dom.newGameButton.classList.remove('hidden');
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

    dom.newMessage(player.playerMove([row, col]), player.computerMove());
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
    enemy.removeEventListener('click', handleEnemyClick);
  }
}

dom.randomizeButton.addEventListener('click', () => {
  player = new Player();
  randomPlaceShips(player.playerBoard);
  dom.appendBoards(player.playerBoard, player.computerBoard, 'ship placing');
  dom.allShipsPlaced();
});

dom.startButton.addEventListener('click', () => {
  dom.randomizeButton.classList.add('hidden');
  randomPlaceShips(player.computerBoard);
  dom.appendBoards(player.playerBoard, player.computerBoard, 'normal play');
  enemy.addEventListener('click', handleEnemyClick);
  dom.startGame();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  dom.submitName();
  e.target.reset();

  player = new Player();
  manualPlaceShips.place(player);
});

dom.newGameButton.addEventListener('click', dom.openForm);
dom.rotateButton.addEventListener('click', manualPlaceShips.rotate);
