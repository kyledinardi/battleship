import Ship from './ship';

function buildBoardNode(gameboard, isPlayer, condition) {
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
}

export default buildBoardNode;
