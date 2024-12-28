class Asteroid {
  constructor(size, loc) {
    if (!loc) {
      let w = random(width);
      let h = random(height);
      while (dist(w, h, width / 2, height / 2) < size * 4) {
        w = random(width);
        h = random(height);
      }
      this.location = createVector(w, h);
    } else {
      this.location = loc.copy();
    }
    this.size = size;
    this.velocity = p5.Vector.random2D();
    this.direction = 0;
    this.rotationAngle = random(radians(-1), radians(1));

    //Shape of the asteroid
    this.pointAmount = floor(random(5, 15));
    this.pointOffsets = [];
    this.maxOffset = -this.size / 2;
    this.avgOffset = 0;
    for (let i = 0; i < this.pointAmount; i++) {
      var tmp = random(-this.size / 2, this.size / 2);
      if (tmp > this.maxOffset) {
        this.maxOffset = tmp;
      }
      this.avgOffset += tmp;
      this.pointOffsets[i] = tmp;
    }
    this.avgOffset /= this.pointAmount;
  }

  update() {
    this.direction += this.rotationAngle;
    this.direction %= radians(360);
    this.location.add(this.velocity);
    if (this.location.x > width + (3 / 2) * this.size) {
      this.location.x = (-this.size * 4) / 3;
    } else if (this.location.x < -(3 / 2) * this.size) {
      this.location.x = width + (this.size * 4) / 3;
    }
    if (this.location.y > height + (3 / 2) * this.size) {
      this.location.y = (-this.size * 3) / 2;
    } else if (this.location.y < -(3 / 2) * this.size) {
      this.location.y = height + (this.size * 3) / 2;
    }
  }

  show() {
    push();
    stroke(255);
    fill(0);
    translate(this.location.x, this.location.y);
    rotate(this.direction);
    beginShape();
    for (let i = 0; i < this.pointAmount; i++) {
      let angle = radians((i * 360) / this.pointAmount);
      let radius = this.size + this.pointOffsets[i];
      vertex(radius * cos(angle), radius * sin(angle));
    }
    endShape(CLOSE);
    pop();
  }

  crumble() {
    let children = [];
    children[0] = new Asteroid(this.size / 2, this.location);
    children[1] = new Asteroid(this.size / 2, this.location);
    return children;
  }
}
