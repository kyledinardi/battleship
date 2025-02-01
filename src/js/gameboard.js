import Ship from './ship';

class Gameboard {
  constructor() {
    this.board = [];
    this.previousAttacks = new Set();

    for (let i = 0; i < 10; i += 1) {
      const temp = [];

      for (let j = 0; j < 10; j += 1) {
        temp.push('empty');
      }

      this.board.push(temp);
    }
  }

  placeShip(name, coordinates) {
    const currentShip = new Ship(name, coordinates.length);

    coordinates.forEach((coordPair) => {
      this.board[coordPair[0]][coordPair[1]] = currentShip;
    });
  }

  receiveAttack(targetCoord) {
    this.previousAttacks.add(targetCoord.join(','));

    const targetCell = this.board[targetCoord[0]][targetCoord[1]];

    if (targetCell instanceof Ship) {
      targetCell.hit();
    } else {
      this.board[targetCoord[0]][targetCoord[1]] = 'miss';
    }
  }

  allSunk() {
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        if (this.board[i][j] instanceof Ship && !this.board[i][j].isSunk()) {
          return false;
        }
      }
    }

    return true;
  }
}

export default Gameboard;
