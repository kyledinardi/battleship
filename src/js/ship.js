class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.timesHit = 0;
  }

  hit() {
    if (!this.isSunk()) {
      this.timesHit += 1;
    }
  }

  isSunk() {
    return this.timesHit === this.length;
  }
}

export default Ship;
