//Emre Nitim - 17011079
//Bu dosya p5.js kütüphanesi kullanılarak yazılmıştır.
let spaceShipSize = 10;
let asteroidAmount = 10;
let asteroidSize = 50;

let game;
let geneticAlgorithm;

let slider;

function setup() {
  createCanvas(640, 550);
  //createCanvas(windowWidth, windowHeight);
  slider = createSlider(1, 10, 10);

  background(0, 0, 0);
  frameRate(60);

  game = new Game(spaceShipSize, asteroidAmount, asteroidSize);
  geneticAlgorithm = new GeneticAlgorithm(
    spaceShipSize,
    asteroidAmount,
    asteroidSize
  );
}

function draw() {
  background(0, 0, 0);
  runGeneticAlgorithm();
  //game.updateAndShow();
}

function runGeneticAlgorithm() {
  geneticAlgorithm.show();
  for (let c = 0; c < slider.value(); c++) {
    geneticAlgorithm.update();
  }
  push();
  textSize(20);
  stroke(255);
  text(
    "Generation: " +
      geneticAlgorithm.generation +
      "\nAlive: " +
      (geneticAlgorithm.populationSize - geneticAlgorithm.deadMembers.length),
    width / 2,
    height / 10
  );
  pop();
}

function keyPressed() {
  if (keyCode == RIGHT_ARROW) {
    game.ship.setRotationAngle(radians(3));
  } else if (keyCode == LEFT_ARROW) {
    game.ship.setRotationAngle(radians(-3));
  } else if (keyCode == UP_ARROW) {
    game.ship.setThrusting(true);
  } else if (key == " ") {
    game.lasers.push(
      new Laser(game.ship.location, game.ship.direction, game.ship.size)
    );
  }
}

function keyReleased() {
  if (keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW) {
    game.ship.setRotationAngle(0);
  } else if (keyCode == UP_ARROW) {
    game.ship.setThrusting(false);
  }
}
