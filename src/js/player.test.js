import Player from './player';

let testPlayer;

beforeEach(() => {
  testPlayer = new Player();
});

test('playerMove() attacks computer gameboard', () => {
  testPlayer.playerMove([0, 0]);
  expect(testPlayer.computerBoard.board[0][0]).toMatch(/miss/);
});

test('playerMove() on empty cell returns "You missed the enemy"', () => {
  expect(testPlayer.playerMove([0, 0])).toBe('You missed the enemy');
});

test('playerMove() on ship cell returns "You hit the enemy!"', () => {
  testPlayer.computerBoard.placeShip('Patrol Boat', [
    [0, 0],
    [0, 1],
  ]);
  expect(testPlayer.playerMove([0, 0])).toBe('You hit the enemy!');
});

test('playerMove() on final ship cell returns "You hit the enemy! You sunk the enemy\'s {ship}!"', () => {
  testPlayer.computerBoard.placeShip('Patrol Boat', [
    [0, 0],
    [0, 1],
  ]);
  testPlayer.playerMove([0, 0]);
  expect(testPlayer.playerMove([0, 1])).toBe(
    "You hit the enemy! You sunk the enemy's Patrol Boat!",
  );
});

test('enemyMessage() on empty cell returns "The enemy missed you"', () => {
  expect(Player.enemyMessage(testPlayer.playerBoard.board[0][0])).toBe(
    'The enemy missed you',
  );
});

test('enemyMessage() on ship cell returns "The enemy hit you!"', () => {
  testPlayer.playerBoard.placeShip('Patrol Boat', [
    [0, 0],
    [0, 1],
  ]);
  expect(Player.enemyMessage(testPlayer.playerBoard.board[0][0])).toBe(
    'The enemy hit you!',
  );
});

test('enemyMessage() on final ship cell returns "The enemy hit you! The enemy sunk your {ship}!"', () => {
  testPlayer.playerBoard.placeShip('Patrol Boat', [
    [0, 0],
    [0, 1],
  ]);
  testPlayer.playerBoard.receiveAttack([0, 0]);
  testPlayer.playerBoard.receiveAttack([0, 1]);
  expect(Player.enemyMessage(testPlayer.playerBoard.board[0][1])).toBe(
    'The enemy hit you! The enemy sunk your Patrol Boat!',
  );
});

test('pushDirections() pushes directions to array', () => {
  testPlayer.pushDirections([1, 1]);
  expect(testPlayer.possibleHits).toEqual([
    [0, 1],
    [2, 1],
    [1, 0],
    [1, 2],
  ]);
});

test('pushDirections() does not push hit coordinates', () => {
  testPlayer.playerBoard.receiveAttack([0, 1]);
  testPlayer.pushDirections([1, 1]);
  expect(testPlayer.possibleHits).toEqual([
    [2, 1],
    [1, 0],
    [1, 2],
  ]);
});

test('pushDirections() does not push already pushed coordinates', () => {
  testPlayer.pushDirections([1, 1]);
  testPlayer.pushDirections([0, 0]);
  expect(testPlayer.possibleHits).toEqual([
    [0, 1],
    [2, 1],
    [1, 0],
    [1, 2],
  ]);
});