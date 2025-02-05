import Ship from './ship';

class Gameboard {
  constructor(size) {
    this.previousAttacks = new Set();
    this.size = size || 10;

    this.board = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }).fill('untargeted'),
    );
  }

  placeShip(ship, coordinates) {
    coordinates.forEach((coordPair) => {
      this.board[coordPair[0]][coordPair[1]] = ship;
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
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        if (this.board[i][j] instanceof Ship && !this.board[i][j].isSunk) {
          return false;
        }
      }
    }

    return true;
  }
}

export default Gameboard;
