import Ship from './ship';

let testShip;

beforeEach(() => {
  testShip = new Ship('Destroyer', 3);
});

test('hit() incements timesHit by one', () => {
  expect(testShip.timesHit).toBe(0);
  testShip.hit();
  expect(testShip.timesHit).toBe(1);
});

test('isSunk() is false when length timesHit is less than length', () => {
  expect(testShip.isSunk()).toBe(false);
  expect(testShip.timesHit).toBeLessThan(testShip.length);
});

test('isSunk() is true when length timesHit is equal to than length', () => {
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.length).toBe(testShip.timesHit);
  expect(testShip.isSunk()).toBe(true);
});
