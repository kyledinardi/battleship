import dom from './dom';

const playerPlaceShips = {
  isVertical: false,

  addEventListeners(player) {
    const board = dom.playerBoardContainer;

    this.rotate = () => {
      this.isVertical = !this.isVertical;
      dom.allShips.textContent = '';
      this.createShips();
    };

    this.dragoverListener = (e) => {
      e.preventDefault();
      e.target.classList.add('temp-ship');
    };

    this.dragleaveListener = (e) => {
      e.preventDefault();
      e.target.classList.remove('temp-ship');
    };

    this.dropListener = (e) => this.dropHandler(e, player);
    dom.rotateButton.addEventListener('click', this.rotate);
    board.addEventListener('dragover', this.dragoverListener);
    board.addEventListener('dragleave', this.dragleaveListener);
    board.addEventListener('drop', this.dropListener);
  },

  removeEventListeners() {
    const board = dom.playerBoardContainer;
    dom.rotateButton.removeEventListener('click', this.rotateButtonListener);
    board.removeEventListener('dragover', this.dragoverListener);
    board.removeEventListener('dragleave', this.dragleaveListener);
    board.removeEventListener('drop', this.dropListener);
  },

  dropHandler(e, player) {
    e.preventDefault();
    let shipName = e.dataTransfer.getData('ship-name');
    const shipDiv = document.querySelector(`#${shipName}`);
    const shipSize = shipDiv.childElementCount;
    const boardSize = player.playerBoard.size;
    const list = e.target.classList;
    const { cell } = e.target.dataset;

    if (
      (!this.isVertical && (cell % boardSize) + shipSize > boardSize) ||
      (this.isVertical &&
        Math.floor(cell / boardSize) + shipSize > boardSize) ||
      !list.contains('cell') ||
      list.contains('visible-ship')
    ) {
      list.remove('temp-ship');
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

    player.playerBoard.placeShip(shipName, coordinates);
    shipDiv.textContent = '';
    dom.appendBoards(player.playerBoard, player.computerBoard, 'ship placing');

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
