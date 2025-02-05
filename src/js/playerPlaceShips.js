import dom from './dom';
import Ship from './ship';

const playerPlaceShips = {
  isVertical: false,

  rotate() {
    playerPlaceShips.isVertical = !playerPlaceShips.isVertical;
    dom.allShips.textContent = '';
    playerPlaceShips.createShips();
  },

  dragover(e) {
    e.preventDefault();
    e.target.classList.add('temp-ship');
  },

  dragleave(e) {
    e.preventDefault();
    e.target.classList.remove('temp-ship');
  },

  drop(e) {
    playerPlaceShips.dropHandler(e);
  },

  addEventListeners(player) {
    const board = dom.playerBoardContainer;
    this.player = player;

    dom.rotateButton.addEventListener('click', this.rotate);
    board.addEventListener('dragover', this.dragover);
    board.addEventListener('dragleave', this.dragleave);
    board.addEventListener('drop', this.drop);
  },

  removeEventListeners() {
    const board = dom.playerBoardContainer;
    dom.rotateButton.removeEventListener('click', this.rotate);
    board.removeEventListener('dragover', this.dragover);
    board.removeEventListener('dragleave', this.dragleave);
    board.removeEventListener('drop', this.drop);
  },

  isValidPlacement(shipSize, boardSize, cell) {
    const allCells = Array.from(
      document.querySelectorAll('#player [data-cell]'),
    );

    let endCell;

    if (this.isVertical) {
      endCell = Math.min(cell + shipSize * boardSize, boardSize ** 2);
    } else {
      endCell = Math.min(
        cell + shipSize,
        Math.ceil(cell / boardSize) * boardSize,
      );
    }

    for (let i = cell; i < endCell; i += this.isVertical ? boardSize : 1) {
      if (allCells[i].classList.contains('visible-ship')) {
        return false;
      }
    }

    if (this.isVertical) {
      return Math.floor(cell / boardSize) + shipSize <= boardSize;
    }

    return (cell % boardSize) + shipSize <= boardSize;
  },

  dropHandler(e) {
    e.preventDefault();

    const shipId = e.dataTransfer.getData('ship-id');
    const currentShip = this.ships.find((tempShip) => tempShip.id === shipId);
    const shipDiv = document.getElementById(shipId);

    const boardSize = this.player.playerBoard.size;
    const cell = Number(e.target.dataset.cell);
    const coordinates = [];

    if (!this.isValidPlacement(currentShip.size, boardSize, cell)) {
      e.target.classList.remove('temp-ship');
      return;
    }

    for (let i = 0; i < currentShip.size; i += 1) {
      if (!this.isVertical) {
        const coord = [Math.floor(cell / boardSize), (cell % boardSize) + i];
        coordinates.push(coord);
      } else {
        const coord = [Math.floor(cell / boardSize) + i, cell % boardSize];
        coordinates.push(coord);
      }
    }

    this.player.playerBoard.placeShip(currentShip, coordinates);
    shipDiv.textContent = '';
    currentShip.inFleet = true;

    dom.appendBoards(
      this.player.playerBoard,
      this.player.computerBoard,
      'ship placing',
    );

    if (this.ships.every((ship) => ship.inFleet)) {
      dom.shipsPlaced();
      this.removeEventListeners();
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
    if (this.isVertical) {
      dom.allShips.classList.add('vertical');
    } else {
      dom.allShips.classList.remove('vertical');
    }

    this.ships.forEach((ship) => {
      const shipName = document.createElement('p');
      shipName.textContent = ship.name;
      dom.allShips.append(shipName);
    });

    this.ships.forEach((ship) => this.createShipDiv(ship));
  },

  place(player) {
    this.ships = [
      new Ship('Carrier', 5),
      new Ship('Battleship', 4),
      new Ship('Destroyer', 3),
      new Ship('Submarine', 3),
      new Ship('Patrol Boat', 2),
    ];

    dom.appendBoards(player.playerBoard, player.computerBoard, 'ship placing');
    this.createShips();
    this.addEventListeners(player);
  },
};

export default playerPlaceShips;
