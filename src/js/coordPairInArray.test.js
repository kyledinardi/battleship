import coordPairInArray from './coordPairInArray';

test('returns true if coordPair is in array', () => {
  expect(
    coordPairInArray(
      [0, 0],
      [
        [0, 0],
        [1, 2],
      ],
    ),
  ).toBe(true);
});

test('returns false if coordPair is not in array', () => {
  expect(
    coordPairInArray(
      [0, 0],
      [
        [1, 2],
        [3, 5],
      ],
    ),
  ).toBe(false);
});
