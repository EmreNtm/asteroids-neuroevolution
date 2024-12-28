class Laser {
  constructor(loc, dir, size) {
    this.shipLocationOffset = p5.Vector.fromAngle(dir)
      .normalize()
      .mult((4 / 3) * size);
    this.location = loc.copy().add(this.shipLocationOffset);
    this.velocity = p5.Vector.fromAngle(dir).normalize().mult(5);
    this.direction = dir;
    this.lazerSize = (size * 4) / 3;
  }

  update() {
    this.location.add(this.velocity);
  }

  show() {
    push();
    stroke(255);
    strokeWeight(4);
    noFill();
    translate(this.location.x, this.location.y);
    rotate(this.direction + PI / 2);
    line(0, 0, 0, this.lazerSize);
    pop();
  }

  showGhostLasers() {
    push();
    stroke(255, 255, 255, 70);
    strokeWeight(4);
    noFill();
    translate(this.location.x, this.location.y);
    rotate(this.direction + PI / 2);
    line(0, 0, 0, this.lazerSize);
    pop();
  }

  isOutOfScreen() {
    if (
      this.location.x > width + this.lazerSize ||
      this.location.x < -this.lazerSize ||
      this.location.y > height + this.lazerSize ||
      this.location.y < -this.lazerSize
    ) {
      return true;
    }
    return false;
  }

  isInRangeOf(asteroid) {
    if (
      dist(
        this.location.x,
        this.location.y,
        asteroid.location.x,
        asteroid.location.y
      ) <=
      asteroid.size + asteroid.maxOffset
    ) {
      return true;
    }
    return false;
  }
}
