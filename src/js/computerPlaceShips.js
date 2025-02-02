function computerPlaceShips(computerBoard) {
  const ships = [
    { name: 'Carrier', size: 5 },
    { name: 'Battleship', size: 4 },
    { name: 'Destroyer', size: 3 },
    { name: 'Submarine', size: 3 },
    { name: 'Patrol Boat', size: 2 },
  ];

  const boardSize = computerBoard.size;

  ships.forEach((ship) => {
    let keepGoing = true;

    while (keepGoing) {
      const isVertical = Math.floor(Math.random() * 2);

      if (isVertical === 0) {
        const row = Math.floor(Math.random() * boardSize);
        const firstColumn = Math.floor(Math.random() * (boardSize - ship.size));
        let allEmpty = true;

        for (let i = 0; i <= ship.size; i += 1) {
          const currentCell = computerBoard.board[row][firstColumn + i];

          if (typeof currentCell === 'object') {
            allEmpty = false;
            break;
          }
        }

        if (allEmpty) {
          const coordinates = [];

          for (let i = 0; i < ship.size; i += 1) {
            coordinates.push([row, firstColumn + i]);
          }

          computerBoard.placeShip(ship.name, coordinates);
        }

        keepGoing = !allEmpty;
      } else {
        const firstRow = Math.floor(Math.random() * (boardSize - ship.size));
        const column = Math.floor(Math.random() * boardSize);
        let allEmpty = true;

        for (let i = 0; i <= ship.size; i += 1) {
          const currentCell = computerBoard.board[firstRow + i][column];

          if (typeof currentCell === 'object') {
            allEmpty = false;
            break;
          }
        }

        if (allEmpty) {
          const coordinates = [];

          for (let i = 0; i < ship.size; i += 1) {
            coordinates.push([firstRow + i, column]);
          }

          computerBoard.placeShip(ship.name, coordinates);
        }

        keepGoing = !allEmpty;
      }
    }
  });
}

export default computerPlaceShips;
