class Star {
  constructor() {
    this.location = createVector(random(width), random(height));
    this.size = floor(random(1, 3));
  }

  show() {
    push();
    stroke(255);
    fill(255);
    translate(this.location.x, this.location.y);
    ellipse(0, 0, this.size, this.size);
    pop();
  }
}
