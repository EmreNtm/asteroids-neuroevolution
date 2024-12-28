class Game {
  constructor(spaceShipSize, asteroidAmount, asteroidSize, neuralNetwork) {
    this.asteroidAmount = asteroidAmount;
    this.asteroidSize = asteroidSize;

    this.asteroids = [];
    this.lasers = [];
    this.stars = [];

    this.ship = new SpaceShip(spaceShipSize);

    for (let i = 0; i < asteroidAmount; i++) {
      this.asteroids.push(new Asteroid(asteroidSize));
    }

    for (let i = 0; i < 100; i++) {
      this.stars.push(new Star());
    }

    this.killCount = 0;
    this.smallAsteroidCount = 0;
    this.moveAmount = 0;
    this.laserAmount = 0;

    if (neuralNetwork) {
      this.neuralNetwork = neuralNetwork;
    } else {
      this.neuralNetwork = new NeuralNetwork();
    }

    this.isAlive = true;

    this.lastLaserShotTime = frameCount;
  }

  updateAndShow() {
    //this.getActionFromNeuralNetwork();

    //Stars
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].show();
    }

    //Asterodis
    for (let i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].update();
      this.asteroids[i].show();

      if (this.ship.isInRangeOf(this.asteroids[i])) {
        noLoop();
      }
    }

    //Lasers
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      this.lasers[i].update();
      this.lasers[i].show();
      if (this.lasers[i].isOutOfScreen()) {
        this.lasers.splice(i, 1);
      } else {
        for (let j = this.asteroids.length - 1; j >= 0; j--) {
          if (this.lasers[i].isInRangeOf(this.asteroids[j])) {
            this.killCount++;
            if (this.asteroids[j].size > 10) {
              this.asteroids = this.asteroids.concat(
                this.asteroids[j].crumble()
              );
            } else {
              this.smallAsteroidCount++;
              if (this.smallAsteroidCount % 8 == 0) {
                this.asteroids.push(
                  new Asteroid(
                    this.asteroidSize,
                    createVector(width + this.asteroidSize, random(height))
                  )
                );
              }
            }
            this.asteroids.splice(j, 1);
            this.lasers.splice(i, 1);
            break;
          }
        }
      }
    }
    this.ship.update();
    this.ship.show();
  }

  update() {
    if (false && frameCount % (60 * 5) == 0) {
      this.isAlive = false;
      console.log("time out!");
    }

    this.getActionFromNeuralNetwork();

    for (let i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].update();

      if (this.ship.isInRangeOf(this.asteroids[i])) {
        this.isAlive = false;
      }
    }

    for (let i = this.lasers.length - 1; i >= 0; i--) {
      this.lasers[i].update();
      if (this.lasers[i].isOutOfScreen()) {
        this.lasers.splice(i, 1);
      } else {
        for (let j = this.asteroids.length - 1; j >= 0; j--) {
          if (this.lasers[i].isInRangeOf(this.asteroids[j])) {
            this.killCount++;
            if (this.asteroids[j].size > 10) {
              this.asteroids = this.asteroids.concat(
                this.asteroids[j].crumble()
              );
            } else {
              this.smallAsteroidCount++;
              if (this.smallAsteroidCount % 8 == 0) {
                this.asteroids.push(
                  new Asteroid(
                    this.asteroidSize,
                    createVector(width + this.asteroidSize, random(height))
                  )
                );
              }
            }
            this.asteroids.splice(j, 1);
            this.lasers.splice(i, 1);
            break;
          }
        }
      }
    }
    this.ship.update();
  }

  show() {
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].show();
    }

    for (let i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].show();
    }

    for (let i = 0; i < this.lasers.length; i++) {
      this.lasers[i].show();
    }

    this.ship.show();
  }

  showGhostShip() {
    for (let i = 0; i < this.lasers.length; i++) {
      this.lasers[i].showGhostLasers();
    }
    this.ship.showGhostShip();
  }

  getActionFromNeuralNetwork() {
    //Create inputs
    let input = [];
    let tmpVector;
    let tmpLocation;
    for (
      let i = 0 + degrees(this.ship.direction);
      i < 360 + degrees(this.ship.direction);
      i += 360 / 16
    ) {
      tmpVector = p5.Vector.fromAngle(radians(i)).normalize().mult(8);
      tmpLocation = this.ship.location.copy();
      do {
        tmpLocation.add(tmpVector);
        //ellipse(tmpLocation.x, tmpLocation.y, 2, 2);
      } while (
        this.isInScreen(tmpLocation) &&
        !this.checkCollision(tmpLocation)
      );

      if (this.isInScreen(tmpLocation)) {
        let distance = dist(
          tmpLocation.x,
          tmpLocation.y,
          this.ship.location.x,
          this.ship.location.y
        );
        input.push(1 - map(distance, 0, width, 0, 1));
      } else {
        input.push(0);
      }
    }
    //console.log(input);

    let action = this.neuralNetwork.findAction(input);

    if (action == 0) {
      this.ship.setThrusting(false);
      this.ship.setRotationAngle(radians(-3));
    } else if (action == 1) {
      this.ship.setThrusting(false);
      this.ship.setRotationAngle(radians(3));
    } else if (action == 2) {
      this.ship.setRotationAngle(0);
      this.ship.setThrusting(true);
      this.moveAmount++;
    } else if (action == 3) {
      this.ship.setRotationAngle(0);
      this.ship.setThrusting(false);
      if (frameCount > this.lastLaserShotTime + 15) {
        this.lasers.push(
          new Laser(this.ship.location, this.ship.direction, this.ship.size)
        );
        this.lastLaserShotTime = frameCount;
        this.laserAmount++;
      }
    } else {
      this.ship.setRotationAngle(0);
      this.ship.setThrusting(false);
    }
  }

  checkCollision(location) {
    for (let i = 0; i < this.asteroids.length; i++) {
      if (this.isInRangeOf(location, this.asteroids[i])) {
        return true;
      }
    }
    return false;
  }

  isInRangeOf(location, asteroid) {
    if (
      dist(location.x, location.y, asteroid.location.x, asteroid.location.y) <=
      asteroid.size + asteroid.avgOffset
    ) {
      return true;
    }
    return false;
  }

  isInScreen(location) {
    if (
      location.x > width ||
      location.x < 0 ||
      location.y > height ||
      location.y < 0
    ) {
      return false;
    }
    return true;
  }
}
