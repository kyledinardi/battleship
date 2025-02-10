import dom from './dom';
import Ship from './ship';

const placeShips = {
  isVertical: false,
  ships: null,
  currentShip: null,
  player: null,
  isNewCellEntered: null,

  rotate() {
    placeShips.isVertical = !placeShips.isVertical;
    dom.allShips.textContent = '';
    placeShips.createShips();
  },

  isValidPlacement(shipSize, boardObj, row, col, isVertical) {
    const end = isVertical ? row + shipSize : col + shipSize;

    if (end > boardObj.size) {
      return false;
    }

    for (let i = 0; i < shipSize; i += 1) {
      let currentCell = boardObj.board[row][col + i];

      if (isVertical) {
        currentCell = boardObj.board[row + i][col];
      }

      if (currentCell instanceof Ship) {
        return false;
      }
    }

    return true;
  },

  removeTempShips() {
    const allCells = document.querySelectorAll('#player .cell');

    allCells.forEach((currentCell) => {
      currentCell.classList.remove('temp-ship');
    });
  },

  dragenter(e) {
    e.preventDefault();
    const { cell } = e.target.dataset;

    if (!placeShips.currentShip || !cell) {
      return;
    }

    const coordinates = [];
    const [row, col] = cell.split(',').map(Number);

    for (let i = 0; i < placeShips.currentShip.size; i += 1) {
      if (placeShips.isVertical) {
        coordinates.push(`${row + i},${col}`);
      } else {
        coordinates.push(`${row},${col + i}`);
      }
    }

    placeShips.removeTempShips();
    placeShips.isNewCellEntered = true;
    const allCells = document.querySelectorAll('#player .cell');

    allCells.forEach((currentCell) => {
      if (coordinates.includes(currentCell.dataset.cell)) {
        currentCell.classList.add('temp-ship');
      }
    });
  },

  dragover(e) {
    const { cell } = e.target.dataset;

    if (!placeShips.currentShip || !cell) {
      return;
    }

    const [row, col] = cell.split(',').map(Number);

    const isValid = placeShips.isValidPlacement(
      placeShips.currentShip.size,
      placeShips.player.playerBoard,
      row,
      col,
      placeShips.isVertical,
    );

    if (isValid) {
      e.preventDefault();
    } else {
      placeShips.removeTempShips();
    }
  },

  dragleave(e) {
    e.preventDefault();

    if (!placeShips.isNewCellEntered) {
      placeShips.removeTempShips();
    }

    placeShips.isNewCellEntered = false;
  },

  drop(e) {
    e.preventDefault();

    const { currentShip } = placeShips;
    const { cell } = e.target.dataset;
    const coordinates = [];
    const [row, col] = cell.split(',').map(Number);

    for (let i = 0; i < currentShip.size; i += 1) {
      if (placeShips.isVertical) {
        coordinates.push([row + i, col]);
      } else {
        coordinates.push([row, col + i]);
      }
    }

    const shipDiv = document.getElementById(placeShips.currentShip.id);
    shipDiv.textContent = '';

    const { playerBoard } = placeShips.player;
    const { computerBoard } = placeShips.player;
    playerBoard.placeShip(currentShip, coordinates);
    dom.appendBoards(playerBoard, computerBoard, 'ship placing');
    currentShip.inFleet = true;

    if (placeShips.ships.every((ship) => ship.inFleet)) {
      dom.allShipsPlaced();
      placeShips.removeEventListeners();
    }
  },

  addEventListeners() {
    const board = dom.playerBoardContainer;
    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];
    events.forEach((event) => board.addEventListener(event, placeShips[event]));
  },

  removeEventListeners() {
    const board = dom.playerBoardContainer;
    const events = ['dragenter', 'dragover', 'dragleave', 'drop'];

    events.forEach((event) =>
      board.removeEventListener(event, placeShips[event]),
    );
  },

  createShipDiv(ship) {
    const shipDiv = document.createElement('div');
    shipDiv.classList.add('ship-div');
    shipDiv.setAttribute('id', ship.id);
    shipDiv.setAttribute('draggable', 'true');

    if (!ship.inFleet) {
      for (let i = 0; i < ship.size; i += 1) {
        const cell = document.createElement('div');
        cell.classList.add('visible-ship');
        cell.dataset.cell = i;
        shipDiv.appendChild(cell);
      }
    }

    shipDiv.addEventListener('dragstart', () => {
      placeShips.currentShip = ship;
    });

    shipDiv.addEventListener('dragend', () => {
      placeShips.currentShip = null;
    });

    return shipDiv;
  },

  createShips() {
    if (placeShips.isVertical) {
      dom.allShips.classList.add('vertical');
    } else {
      dom.allShips.classList.remove('vertical');
    }

    placeShips.ships.forEach((ship) => {
      const shipName = document.createElement('p');
      shipName.textContent = ship.name;
      dom.allShips.append(shipName);
    });

    placeShips.ships.forEach((ship) => {
      const shipDiv = placeShips.createShipDiv(ship);
      dom.allShips.append(shipDiv);
    });
  },

  place(player) {
    placeShips.ships = [
      new Ship('Carrier', 5),
      new Ship('Battleship', 4),
      new Ship('Destroyer', 3),
      new Ship('Submarine', 3),
      new Ship('Patrol Boat', 2),
    ];

    dom.appendBoards(player.playerBoard, player.computerBoard, 'ship placing');
    placeShips.player = player;
    placeShips.createShips();
    placeShips.addEventListeners();
  },
};

export default placeShips;
