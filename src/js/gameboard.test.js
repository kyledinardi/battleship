import Gameboard from './gameboard';

let testGameboard;

beforeEach(() => {
  testGameboard = new Gameboard();
});

test('gameboard has 10 x 10 spaces', () => {
  expect(testGameboard.board.length).toBe(10);
  expect(testGameboard.board[0].length).toBe(10);
});

test('placeShip() places ship', () => {
  testGameboard.placeShip('Patrol Boat', [
    [0, 0],
    [0, 1],
  ]);
  expect(testGameboard.board[0][0]).toEqual({
    name: 'Patrol Boat',
    length: 2,
    timesHit: 0,
  });
  expect(testGameboard.board[0][1]).toEqual({
    name: 'Patrol Boat',
    length: 2,
    timesHit: 0,
  });
  expect(testGameboard.board[0][2]).toMatch(/empty/);
});

test('receiveAttack() pushes coordinates to previousAttacks', () => {
  testGameboard.receiveAttack([0, 0]);
  expect(testGameboard.previousAttacks).toEqual([[0, 0]]);
});

test('receiveAttack() on ship increases timesHit', () => {
  testGameboard.placeShip('Patrol Boat', [
    [0, 0],
    [0, 1],
  ]);
  testGameboard.receiveAttack([0, 0]);
  expect(testGameboard.board[0][0].timesHit).toBe(1);
});

test('receiveAttack() on empty changes to miss', () => {
  testGameboard.receiveAttack([0, 0]);
  expect(testGameboard.board[0][0]).toMatch(/miss/);
});

test('allSunk() returns false if working ships exist', () => {
  testGameboard.placeShip('Patrol Boat', [
    [0, 0],
    [0, 1],
  ]);
  expect(testGameboard.allSunk()).toBe(false);
});

test('allSunk() returns true if all ships are sunk', () => {
  testGameboard.placeShip('Patrol Boat', [
    [0, 0],
    [0, 1],
  ]);
  testGameboard.receiveAttack([0, 0]);
  testGameboard.receiveAttack([0, 1]);
  expect(testGameboard.allSunk()).toBe(true);
});
