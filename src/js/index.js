import '../style.css';
import Player from './player';
import dom from './dom';
import playerPlaceShips from './playerPlaceShips';
import computerPlaceShips from './computerPlaceShips';

const form = document.querySelector('form');
let player;
let startButton;
let isGameOver = false;

function endGame() {
  if (isGameOver) {
    return;
  }
  if (player.computerBoard.allSunk()) {
    dom.newMessage('Enemy fleet sunk! You win!');
  } else {
    dom.newMessage('Your fleet was sunk! Game over!');
  }

  dom.appendBoards(player.playerBoard, player.computerBoard, 'game over');
  dom.endGame();

  const enemy = document.querySelector('#enemy');
  const newGameButton = document.querySelector('.new-game');
  enemy.replaceWith(enemy.cloneNode(true));
  newGameButton.addEventListener('click', dom.openForm);
}

function playRound(e) {
  e.stopImmediatePropagation();

  if (
    e.target.classList.contains('cell') &&
    !e.target.classList.contains('attacked')
  ) {
    const { cell } = e.target.dataset;
    const message1 = player.playerMove([Math.floor(cell / 10), cell % 10]);
    const message2 = player.computerMove();
    dom.newMessage(message1, message2);
    dom.appendBoards(player.playerBoard, player.computerBoard, 'normal play');
  }
  if (player.playerBoard.allSunk() || player.computerBoard.allSunk()) {
    endGame();
    isGameOver = true;
  }
}

form.addEventListener('submit', (e) => {
  player = new Player();
  dom.startGame(e);
  playerPlaceShips.place(player);
  startButton = document.querySelector('.start');

  startButton.addEventListener('click', () => {
    computerPlaceShips(player.computerBoard);
    dom.appendBoards(player.playerBoard, player.computerBoard, 'normal play');
    dom.newMessage('Fire when ready!');
    
    const enemy = document.querySelector('#enemy');
    enemy.addEventListener('click', playRound);
    startButton.remove();
  });
});
