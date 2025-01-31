import './style.css';
import Player from './js/player';
import dom from './js/dom';
import playerPlaceShips from './js/playerPlaceShips';
import computerPlaceShips from './js/computerPlaceShips';

const form = document.querySelector('form');
let player;

function endGame() {
  if (player.computerBoard.allSunk()) {
    dom.newMessage('Enemy fleet sunk!', ' You win!');
  } else {
    dom.newMessage('Your fleet was sunk!', 'Game over!');
  }

  dom.appendBoards(player.playerBoard, player.computerBoard, 'game over');
  dom.endGame();

  const newGameButton = document.querySelector('.new-game');
  newGameButton.addEventListener('click', dom.openForm);
}

function playRound(e) {
  e.stopImmediatePropagation();

  if (
    e.target.classList.contains('cell') &&
    !e.target.classList.contains('attacked')
  ) {
    const { cell } = e.target.dataset;
    const [row, col] = [Math.floor(cell / 10), cell % 10];
    const message1 = player.playerMove([row, col]);
    const message2 = player.computerMove();
    dom.newMessage(message1, message2);
    dom.appendBoards(player.playerBoard, player.computerBoard, 'normal play');
  }

  if (player.playerBoard.allSunk() || player.computerBoard.allSunk()) {
    endGame();
  }
}

form.addEventListener('submit', (e) => {
  player = new Player();
  dom.startGame(e);
  playerPlaceShips.place(player);
  const startButton = document.querySelector('.start');

  startButton.addEventListener('click', () => {
    computerPlaceShips(player.computerBoard);
    dom.appendBoards(player.playerBoard, player.computerBoard, 'normal play');
    dom.newMessage('Fire when ready!', '');

    const enemy = document.querySelector('#enemy');
    enemy.addEventListener('click', playRound);
    startButton.remove();
  });
});
