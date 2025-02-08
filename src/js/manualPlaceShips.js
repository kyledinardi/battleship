import dom from './dom';
import Ship from './ship';

const manualPlaceShips = {
  isVertical: false,

  rotate() {
    manualPlaceShips.isVertical = !manualPlaceShips.isVertical;
    dom.allShips.textContent = '';
    manualPlaceShips.createShips();
  },

  dragover(e) {
    e.preventDefault();

    if (e.dataTransfer.types.includes('ship-id')) {
      e.target.classList.add('temp-ship');
    }
  },

  dragleave(e) {
    e.preventDefault();
    e.target.classList.remove('temp-ship');
  },

  drop(e) {
    e.preventDefault();
    manualPlaceShips.dropHandler(e);
  },

  addEventListeners(player) {
    const board = dom.playerBoardContainer;
    manualPlaceShips.player = player;
    manualPlaceShips.playerCells = document.querySelectorAll('#player .cell');

    board.addEventListener('dragover', manualPlaceShips.dragover);
    board.addEventListener('dragleave', manualPlaceShips.dragleave);
    board.addEventListener('drop', manualPlaceShips.drop);
  },

  removeEventListeners() {
    const board = dom.playerBoardContainer;
    board.removeEventListener('dragover', manualPlaceShips.dragover);
    board.removeEventListener('dragleave', manualPlaceShips.dragleave);
    board.removeEventListener('drop', manualPlaceShips.drop);
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

  dropHandler(e) {
    const shipId = e.dataTransfer.getData('ship-id');

    const currentShip = manualPlaceShips.ships.find(
      (tempShip) => tempShip.id === shipId,
    );

    const shipDiv = document.getElementById(shipId);

    const { playerBoard } = manualPlaceShips.player;
    const { computerBoard } = manualPlaceShips.player;
    const boardSize = playerBoard.size;

    const row = Math.floor(Number(e.target.dataset.cell) / boardSize);
    const col = Number(e.target.dataset.cell) % boardSize;
    const coordinates = [];

    const isValid = manualPlaceShips.isValidPlacement(
      currentShip.size,
      playerBoard,
      row,
      col,
      manualPlaceShips.isVertical,
    );

    if (!isValid) {
      e.target.classList.remove('temp-ship');
      return;
    }

    for (let i = 0; i < currentShip.size; i += 1) {
      if (manualPlaceShips.isVertical) {
        coordinates.push([row + i, col]);
      } else {
        coordinates.push([row, col + i]);
      }
    }

    playerBoard.placeShip(currentShip, coordinates);
    shipDiv.textContent = '';
    currentShip.inFleet = true;
    dom.appendBoards(playerBoard, computerBoard, 'ship placing');

    if (manualPlaceShips.ships.every((ship) => ship.inFleet)) {
      dom.allShipsPlaced();
      manualPlaceShips.removeEventListeners();
    }
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

    dom.allShips.append(shipDiv);

    shipDiv.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('ship-id', e.target.id);
    });
  },

  createShips() {
    if (manualPlaceShips.isVertical) {
      dom.allShips.classList.add('vertical');
    } else {
      dom.allShips.classList.remove('vertical');
    }

    manualPlaceShips.ships.forEach((ship) => {
      const shipName = document.createElement('p');
      shipName.textContent = ship.name;
      dom.allShips.append(shipName);
    });

    manualPlaceShips.ships.forEach((ship) =>
      manualPlaceShips.createShipDiv(ship),
    );
  },

  place(player) {
    manualPlaceShips.ships = [
      new Ship('Carrier', 5),
      new Ship('Battleship', 4),
      new Ship('Destroyer', 3),
      new Ship('Submarine', 3),
      new Ship('Patrol Boat', 2),
    ];

    dom.appendBoards(player.playerBoard, player.computerBoard, 'ship placing');
    manualPlaceShips.createShips();
    manualPlaceShips.addEventListeners(player);
  },
};

export default manualPlaceShips;
