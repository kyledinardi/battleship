import placeShips from './placeShips';
import Ship from './ship';

function randomPlaceShips(board) {
  const ships = [
    new Ship('Carrier', 5),
    new Ship('Battleship', 4),
    new Ship('Destroyer', 3),
    new Ship('Submarine', 3),
    new Ship('Patrol Boat', 2),
  ];

  const shipDivs = document.querySelectorAll('.ship-div');

  for (let i = 0; i < shipDivs.length; i += 1) {
    shipDivs[i].textContent = '';
  }

  ships.forEach((ship) => {
    let isValid = false;

    while (!isValid) {
      const isVertical = Math.floor(Math.random() * 2);

      const coordinates = [];
      let row = Math.floor(Math.random() * board.size);
      let col = Math.floor(Math.random() * (board.size - ship.size));

      if (isVertical === 1) {
        row = Math.floor(Math.random() * (board.size - ship.size));
        col = Math.floor(Math.random() * board.size);
      }

      isValid = placeShips.isValidPlacement(
        ship.size,
        board,
        row,
        col,
        isVertical,
      );

      if (isValid) {
        for (let i = 0; i < ship.size; i += 1) {
          coordinates.push(isVertical ? [row + i, col] : [row, col + i]);
        }

        board.placeShip(ship, coordinates);
      }
    }
  });
}

export default randomPlaceShips;
