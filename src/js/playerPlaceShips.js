import dom from './dom';

const playerPlaceShips = {
  isVertical: false,

  ships: [
    { name: 'Carrier', size: 5, inFleet: false },
    { name: 'Battleship', size: 4, inFleet: false },
    { name: 'Destroyer', size: 3, inFleet: false },
    { name: 'Submarine', size: 3, inFleet: false },
    { name: 'Patrol Boat', size: 2, inFleet: false },
  ],

  shipsPlaced() {
    const startButton = document.querySelector('.start');
    const rotateButton = document.querySelector('.rotate');
    const allShips = document.querySelector('.all-ships');
    rotateButton.remove();
    allShips.remove();
    startButton.style.display = 'inline';
  },

  dropHandler(e, player) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    const shipDiv = document.querySelector(`#${data}`);
    const size = shipDiv.childElementCount;
    const list = e.target.classList;
    const { cell } = e.target.dataset;

    if (
      (!this.isVertical && (cell % 10) + size > 10) ||
      (this.isVertical && Math.floor(cell / 10) + size > 10) ||
      !list.contains('cell') ||
      list.contains('visible-ship')
    ) {
      list.remove('temp-ship');
      return;
    }

    const coordinates = [];

    for (let i = 0; i < size; i += 1) {
      if (!this.isVertical) {
        coordinates.push([Math.floor(cell / 10), (cell % 10) + i]);
      } else {
        coordinates.push([Math.floor(cell / 10) + i, cell % 10]);
      }
    }

    player.playerBoard.placeShip(data, coordinates);
    shipDiv.textContent = '';
    dom.appendBoards(player.playerBoard, player.computerBoard, 'ship placing');

    const shipName = data === 'Patrol-Boat' ? 'Patrol Boat' : data;
    const currentShip = this.ships.find((ship) => ship.name === shipName);
    currentShip.inFleet = true;

    for (let i = 0; i < this.ships.length; i += 1) {
      if (!this.ships[i].inFleet) {
        return;
      }
    }

    this.shipsPlaced();
  },

  createShips() {
    const allShips = document.querySelector('.all-ships');

    if (this.isVertical) {
      allShips.classList.add('vertical');
    } else {
      allShips.classList.remove('vertical');
    }

    if (this.isVertical) {
      this.ships.forEach((ship) => {
        const shipName = document.createElement('p');
        shipName.textContent = ship.name;
        allShips.append(shipName);
      });
    }

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

      if (!this.isVertical) {
        const shipName = document.createElement('p');
        shipName.textContent = ship.name;
        allShips.append(shipName);
      }

      allShips.append(shipDiv);

      shipDiv.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text', e.target.id);
      });
    });
  },

  place(player) {
    const messageBox = document.querySelector('.message-box');
    const playerBoardContainer = document.querySelector('#player');
    const startButton = document.createElement('button');
    const allShips = document.createElement('div');
    const rotateButton = document.createElement('button');

    this.ships = [
      { name: 'Carrier', size: 5, inFleet: false },
      { name: 'Battleship', size: 4, inFleet: false },
      { name: 'Destroyer', size: 3, inFleet: false },
      { name: 'Submarine', size: 3, inFleet: false },
      { name: 'Patrol Boat', size: 2, inFleet: false },
    ];

    startButton.textContent = 'Start';
    rotateButton.textContent = 'Rotate';
    startButton.classList.add('start');
    rotateButton.classList.add('rotate');
    allShips.classList.add('all-ships');
    startButton.style.display = 'none';

    messageBox.appendChild(startButton);
    messageBox.appendChild(rotateButton);
    messageBox.append(allShips);

    rotateButton.addEventListener('click', () => {
      this.isVertical = !this.isVertical;
      allShips.textContent = '';
      this.createShips();
    });

    dom.appendBoards(player.playerBoard, player.computerBoard, 'ship placing');
    this.createShips();

    playerBoardContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.target.classList.add('temp-ship');
    });

    playerBoardContainer.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.target.classList.remove('temp-ship');
    });

    playerBoardContainer.addEventListener('drop', (e) => {
      this.dropHandler(e, player);
    });
  },
};

export default playerPlaceShips;
