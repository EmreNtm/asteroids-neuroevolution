class SpaceShip {
  constructor(size) {
    this.location = createVector(
      width / 2 + random(-100, 100),
      height / 2 + random(-100, 100)
    );
    this.size = size;
    this.velocity = createVector(0, 0);
    this.direction = random(0, 2 * PI);
    this.rotationAngle = 0;
    this.isThrusting = false;
    this.maxSpeed = 5;
  }

  update() {
    //Turn
    this.direction += this.rotationAngle;
    this.direction %= radians(360);

    //Boost
    if (this.isThrusting) {
      this.velocity.add(
        p5.Vector.fromAngle(this.direction).normalize().mult(0.2)
      );
    }

    //Max speed
    if (this.velocity.mag() > this.maxSpeed) {
      this.velocity.normalize().mult(this.maxSpeed);
    }

    //Friction
    this.velocity.mult(0.98);

    //Move
    this.location.add(this.velocity);

    //Edges
    if (this.location.x > width + (4 / 3) * this.size) {
      this.location.x = (-this.size * 4) / 3;
    } else if (this.location.x < -(4 / 3) * this.size) {
      this.location.x = width + (this.size * 4) / 3;
    }
    if (this.location.y > height + (4 / 3) * this.size) {
      this.location.y = (-this.size * 4) / 3;
    } else if (this.location.y < -(4 / 3) * this.size) {
      this.location.y = height + (this.size * 4) / 3;
    }
  }

  show() {
    push();
    stroke(255);
    fill(0);
    translate(this.location.x, this.location.y);
    rotate(this.direction + PI / 2);
    triangle(
      -this.size,
      (this.size * 2) / 3,
      this.size,
      (this.size * 2) / 3,
      0,
      (-this.size * 4) / 3
    );
    rect(-this.size / 2, (this.size * 2) / 3, this.size, this.size / 3);
    if (this.isThrusting) {
      line(
        -this.size / 4,
        (this.size * 3) / 3,
        -this.size / 4,
        (this.size * 5) / 3
      );
      line(
        this.size / 4,
        (this.size * 3) / 3,
        this.size / 4,
        (this.size * 5) / 3
      );
    }
    pop();
  }

  showGhostShip() {
    push();
    stroke(255, 255, 255, 100);
    fill(0);
    translate(this.location.x, this.location.y);
    rotate(this.direction + PI / 2);
    triangle(
      -this.size,
      (this.size * 2) / 3,
      this.size,
      (this.size * 2) / 3,
      0,
      (-this.size * 4) / 3
    );
    rect(-this.size / 2, (this.size * 2) / 3, this.size, this.size / 3);
    if (this.isThrusting) {
      line(
        -this.size / 4,
        (this.size * 3) / 3,
        -this.size / 4,
        (this.size * 5) / 3
      );
      line(
        this.size / 4,
        (this.size * 3) / 3,
        this.size / 4,
        (this.size * 5) / 3
      );
    }
    pop();
  }

  setRotationAngle(angle) {
    this.rotationAngle = angle;
  }

  setThrusting(value) {
    this.isThrusting = value;
  }

  isInRangeOf(asteroid) {
    if (
      dist(
        this.location.x,
        this.location.y,
        asteroid.location.x,
        asteroid.location.y
      ) <=
      asteroid.size + asteroid.avgOffset
    ) {
      return true;
    }
    return false;
  }
}
