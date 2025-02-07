import Gameboard from './gameboard';
import Ship from './ship';

class Player {
  constructor() {
    this.playerBoard = new Gameboard();
    this.computerBoard = new Gameboard();
    this.possibleHits = [];
    this.search = false;
  }

  static generateAttackMessage(targetCell, isPlayer) {
    let message = isPlayer ? 'You missed the enemy.' : 'The enemy missed you.';

    if (targetCell instanceof Ship) {
      message = isPlayer ? 'You hit the enemy!' : 'The enemy hit you!';

      if (targetCell.isSunk) {
        message = `${message} ${
          isPlayer ? "You sunk the enemy's" : 'The enemy sunk your'
        } ${targetCell.name}!`;
      }
    }

    return message;
  }

  coordPairInPossibleHits(coordPair) {
    return this.possibleHits.some(
      (pHit) => pHit[0] === coordPair[0] && pHit[1] === coordPair[1],
    );
  }

  playerMove(targetCoord) {
    this.computerBoard.receiveAttack(targetCoord);
    const targetCell = this.computerBoard.board[targetCoord[0]][targetCoord[1]];
    return Player.generateAttackMessage(targetCell, true);
  }

  checkAndPushDirection(targetCoord, direction) {
    const [row, col] = targetCoord;
    const [deltaRow, deltaCol] = direction;
    const newCoord = [row + deltaRow, col + deltaCol];

    const isValidCoord =
      newCoord[0] >= 0 &&
      newCoord[0] < this.playerBoard.board.length &&
      newCoord[1] >= 0 &&
      newCoord[1] < this.playerBoard.board[0].length;

    if (
      isValidCoord &&
      !this.playerBoard.previousAttacks.has(newCoord.join(',')) &&
      !this.coordPairInPossibleHits(newCoord)
    ) {
      this.possibleHits.push(newCoord);
    }
  }

  pushDirections(targetCoord) {
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    directions.forEach((direction) =>
      this.checkAndPushDirection(targetCoord, direction),
    );
  }

  searchAndDestroy() {
    const targetCoord = this.possibleHits.shift();
    this.playerBoard.receiveAttack(targetCoord);
    const boardCoord = this.playerBoard.board[targetCoord[0]][targetCoord[1]];

    if (boardCoord instanceof Ship) {
      this.pushDirections(targetCoord);
    }

    if (this.possibleHits.length === 0) {
      this.search = false;
    }

    return boardCoord;
  }

  computerMove() {
    let targetCell;

    if (this.search === true) {
      targetCell = this.searchAndDestroy();
    } else {
      let row = Math.floor(Math.random() * this.playerBoard.size);
      let col = Math.floor(Math.random() * this.playerBoard.size);

      while (this.playerBoard.previousAttacks.has(`${row},${col}`)) {
        row = Math.floor(Math.random() * this.playerBoard.size);
        col = Math.floor(Math.random() * this.playerBoard.size);
      }

      this.playerBoard.receiveAttack([row, col]);
      targetCell = this.playerBoard.board[row][col];

      if (targetCell instanceof Ship) {
        this.search = true;
        this.pushDirections([row, col]);
      }
    }

    return Player.generateAttackMessage(targetCell, false);
  }
}

export default Player;
