class Ship {
  constructor(name, size) {
    this.name = name;
    this.size = size;
    this.inFleet = false;
    this.isSunk = false;
    this.timesHit = 0;
    this.id = name.toLowerCase().replace(' ', '-');
  }

  hit() {
    if (!this.isSunk) {
      this.timesHit += 1;

      if (this.timesHit === this.size) {
        this.isSunk = true;
      }
    }
  }
}

export default Ship;
