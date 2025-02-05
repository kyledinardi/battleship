import dom from './dom';

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
    let shipName = e.dataTransfer.getData('ship-name');
    const shipDiv = document.querySelector(`#${shipName}`);
    const shipSize = shipDiv.childElementCount;
    const boardSize = this.player.playerBoard.size;
    const cell = Number(e.target.dataset.cell);

    if (!this.isValidPlacement(shipSize, boardSize, cell)) {
      e.target.classList.remove('temp-ship');
      return;
    }

    const coordinates = [];

    for (let i = 0; i < shipSize; i += 1) {
      if (!this.isVertical) {
        coordinates.push([
          Math.floor(cell / boardSize),
          (cell % boardSize) + i,
        ]);
      } else {
        coordinates.push([Math.floor(cell / boardSize) + i, cell % boardSize]);
      }
    }

    this.player.playerBoard.placeShip(shipName, coordinates);
    shipDiv.textContent = '';

    dom.appendBoards(
      this.player.playerBoard,
      this.player.computerBoard,
      'ship placing',
    );

    if (shipName === 'Patrol-Boat') {
      shipName = 'Patrol Boat';
    }

    const currentShip = this.ships.find((ship) => ship.name === shipName);
    currentShip.inFleet = true;

    for (let i = 0; i < this.ships.length; i += 1) {
      if (!this.ships[i].inFleet) {
        return;
      }
    }

    if (this.ships.every((ship) => ship.inFleet)) {
      dom.shipsPlaced();
      this.removeEventListeners();
    }
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

    this.ships.forEach((ship) => {
      const shipDiv = document.createElement('div');
      shipDiv.classList.add('ship-div');
      const idName = ship.name === 'Patrol Boat' ? 'Patrol-Boat' : ship.name;
      shipDiv.setAttribute('id', idName);
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
        e.dataTransfer.setData('ship-name', e.target.id);
      });
    });
  },

  place(player) {
    this.ships = [
      { name: 'Carrier', size: 5, inFleet: false },
      { name: 'Battleship', size: 4, inFleet: false },
      { name: 'Destroyer', size: 3, inFleet: false },
      { name: 'Submarine', size: 3, inFleet: false },
      { name: 'Patrol Boat', size: 2, inFleet: false },
    ];

    dom.appendBoards(player.playerBoard, player.computerBoard, 'ship placing');
    this.createShips();
    this.addEventListeners(player);
  },
};

export default playerPlaceShips;
