import Ship from './ship';

const dom = {
  startGame(e) {
    e.preventDefault();
    const app = document.querySelector('#app');
    const form = document.querySelector('form');
    const nameInput = document.querySelector('#name');

    const name = nameInput.value || 'Player';
    form.style.display = 'none';
    e.target.reset();

    const messageBox = document.createElement('div');
    const messageP1 = document.createElement('p');
    const messageP2 = document.createElement('p');
    const gameContent = document.createElement('div');
    const playerContent = document.createElement('div');
    const enemyContent = document.createElement('div');
    const playerCaption = document.createElement('h3');
    const enemyCaption = document.createElement('h3');
    const playerBoardContainer = document.createElement('div');
    const enemyBoardContainer = document.createElement('div');

    messageBox.classList.add('message-box');
    gameContent.classList.add('game-content');
    playerContent.classList.add('player-content');
    enemyContent.classList.add('player-content');
    playerCaption.classList.add('caption');
    enemyCaption.classList.add('caption');

    playerBoardContainer.setAttribute('class', 'board-container');
    playerBoardContainer.setAttribute('id', 'player');
    enemyBoardContainer.setAttribute('class', 'board-container');
    enemyBoardContainer.setAttribute('id', 'enemy');

    playerCaption.textContent = `${name}'s Fleet`;
    enemyCaption.textContent = `Enemy Fleet`;

    messageBox.appendChild(messageP1);
    messageBox.appendChild(messageP2);
    playerContent.appendChild(playerCaption);
    playerContent.appendChild(playerBoardContainer);
    enemyContent.appendChild(enemyCaption);
    enemyContent.appendChild(enemyBoardContainer);
    gameContent.appendChild(playerContent);
    gameContent.appendChild(enemyContent);

    app.insertBefore(messageBox, form);
    app.insertBefore(gameContent, messageBox);
  },

  endGame() {
    const messageBox = document.querySelector('.message-box');
    const newGameButton = document.createElement('button');
    newGameButton.classList.add('new-game');
    newGameButton.textContent = 'New Game';
    messageBox.appendChild(newGameButton);
  },

  openForm() {
    const messageBox = document.querySelector('.message-box');
    const gameContent = document.querySelector('.game-content');
    const form = document.querySelector('form');

    messageBox.remove();
    gameContent.remove();
    form.style.display = 'block';
  },

  buildBoard(gameboard, isPlayer, condition) {
    const { size } = gameboard;
    const board = document.createElement('div');
    board.classList.add('board');

    for (let i = 0; i < size ** 2; i += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.cell = i;

      if (
        gameboard.board[Math.floor(i / size)][i % size] instanceof Ship &&
        (isPlayer || condition === 'game over')
      ) {
        cell.classList.add('visible-ship');
      }

      if (
        !isPlayer &&
        condition === 'normal play' &&
        !cell.classList.contains('attacked')
      ) {
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
    const boardContainers = document.querySelectorAll('.board-container');

    boardContainers[0].textContent = '';
    boardContainers[1].textContent = '';
    boardContainers[0].appendChild(playerBoardNode);
    boardContainers[1].appendChild(computerBoardNode);
  },

  newMessage(message1, message2) {
    const messagePs = document.querySelectorAll('.message-box p');
    messagePs[0].textContent = message1;
    messagePs[1].textContent = message2;
  },
};

export default dom;
