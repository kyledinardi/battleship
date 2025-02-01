import Gameboard from './gameboard';
import coordPairInArray from './coordPairInArray';
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

      if (targetCell.isSunk()) {
        message = `${message} ${
          isPlayer ? "You sunk the enemy's" : 'The enemy sunk your'
        } ${targetCell.name}!`;
      }
    }

    return message;
  }

  playerMove(targetCoord) {
    this.computerBoard.receiveAttack(targetCoord);
    const targetCell = this.computerBoard.board[targetCoord[0]][targetCoord[1]];
    return Player.generateAttackMessage(targetCell, true);
  }

  checkAndPushDirection(targetCoord, direction) {
    const [row, column] = targetCoord;
    const [deltaRow, deltaColumn] = direction;
    const newCoord = [row + deltaRow, column + deltaColumn];

    const isValidRow =
      newCoord[0] >= 0 && newCoord[0] < this.playerBoard.board.length;

    const isValidColumn =
      newCoord[1] >= 0 && newCoord[1] < this.playerBoard.board[0].length;

    if (
      isValidRow &&
      isValidColumn &&
      !this.playerBoard.previousAttacks.has(newCoord.join(',')) &&
      !coordPairInArray(newCoord, this.possibleHits)
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
      let column = Math.floor(Math.random() * this.playerBoard.size);

      while (this.playerBoard.previousAttacks.has(`${row},${column}`)) {
        row = Math.floor(Math.random() * this.playerBoard.size);
        column = Math.floor(Math.random() * this.playerBoard.size);
      }

      this.playerBoard.receiveAttack([row, column]);
      targetCell = this.playerBoard.board[row][column];

      if (targetCell instanceof Ship) {
        this.search = true;
        this.pushDirections([row, column]);
      }
    }

    return Player.generateAttackMessage(targetCell, false);
  }
}

export default Player;
