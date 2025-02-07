import Ship from './ship';

const dom = {
  app: document.querySelector('#app'),
  form: document.querySelector('form'),
  nameInput: document.querySelector('#name'),
  gameContent: document.querySelector('.game-content'),

  playerContent: document.querySelector('#player'),
  playerCaption: document.querySelector('#player .caption'),
  playerBoardContainer: document.querySelector('#player .board-container'),

  enemyContent: document.querySelector('#enemy'),
  enemyCaption: document.querySelector('#enemy .caption'),
  enemyBoardContainer: document.querySelector('#enemy .board-container'),

  messageBox: document.querySelector('.message-box'),
  message1: document.querySelector('#message1'),
  message2: document.querySelector('#message2'),
  buttonsAndShips: document.querySelector('.buttons-and-ships'),
  allShips: document.querySelector('.all-ships'),

  randomizeButton: document.querySelector('.randomize'),
  rotateButton: document.querySelector('.rotate'),
  startButton: document.querySelector('.start'),
  newGameButton: document.querySelector('.new-game'),

  submitName() {
    const name = dom.nameInput.value || 'Player';

    dom.playerCaption.textContent = `${name}'s Fleet`;
    dom.enemyCaption.textContent = `Enemy Fleet`;
    dom.gameContent.classList.remove('hidden');
    dom.buttonsAndShips.classList.remove('hidden');

    dom.form.classList.add('hidden');
  },

  allShipsPlaced() {
    dom.allShipsPlaced.textContent = '';
    dom.allShips.classList.add('hidden');
    dom.rotateButton.classList.add('hidden');
    dom.startButton.classList.remove('hidden');
  },

  startGame() {
    dom.startButton.classList.add('hidden');
    dom.messageBox.classList.remove('hidden');
    dom.newMessage('Fire when ready!', '');
  },

  openForm() {
    dom.form.classList.remove('hidden');
    dom.allShips.classList.remove('hidden');
    dom.randomizeButton.classList.remove('hidden');
    dom.rotateButton.classList.remove('hidden');

    dom.gameContent.classList.add('hidden');
    dom.messageBox.classList.add('hidden');
    dom.buttonsAndShips.classList.add('hidden');
    dom.newGameButton.classList.add('hidden');
    dom.newMessage('', '');
  },

  buildBoard(gameboard, isPlayer, condition) {
    const { size } = gameboard;
    const board = document.createElement('div');
    board.classList.add('board');

    for (let i = 0; i < size ** 2; i += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.cell = i;

      const isShip =
        gameboard.board[Math.floor(i / size)][i % size] instanceof Ship;

      if (isShip && (isPlayer || condition === 'game over')) {
        cell.classList.add('visible-ship');
      }

      const isClickable =
        !isPlayer &&
        condition === 'normal play' &&
        !cell.classList.contains('attacked');

      if (isClickable) {
        cell.classList.add('clickable');
      }

      gameboard.previousAttacks.forEach((attack) => {
        const [row, col] = attack.split(',').map(Number);

        if (row === Math.floor(i / size) && col === i % size) {
          cell.classList.add('attacked');

          if (gameboard.board[row][col] instanceof Ship) {
            cell.classList.add('hit');
          }
        }
      });

      board.appendChild(cell);
    }

    return board;
  },

  appendBoards(playerBoard, computerBoard, condition) {
    const playerBoardNode = dom.buildBoard(playerBoard, true, condition);
    const computerBoardNode = dom.buildBoard(computerBoard, false, condition);

    dom.playerBoardContainer.textContent = '';
    dom.enemyBoardContainer.textContent = '';
    dom.playerBoardContainer.appendChild(playerBoardNode);
    dom.enemyBoardContainer.appendChild(computerBoardNode);
  },

  newMessage(message1, message2) {
    dom.message1.textContent = message1;
    dom.message2.textContent = message2;
  },
};

export default dom;
