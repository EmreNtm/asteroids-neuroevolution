class GeneticAlgorithm {
  constructor(spaceShipSize, asteroidAmount, asteroidSize) {
    this.spaceShipSize = spaceShipSize;
    this.asteroidAmount = asteroidAmount;
    this.asteroidSize = asteroidSize;

    this.populationSize = 128;
    this.population = [];
    this.fitness = [];
    this.fitnessLifetime = [];
    this.fitnessKill = [];
    this.fitnessLaser = [];
    this.fitnessMove = [];

    for (let i = 0; i < this.populationSize; i++) {
      this.population.push(
        new Game(spaceShipSize, asteroidAmount, asteroidSize)
      );
    }

    this.deadMembers = [];
    this.generation = 1;
  }

  show() {
    let flag = 0;
    for (let i = 0; i < this.populationSize; i++) {
      if (this.population[i].isAlive && flag == 0) {
        this.population[i].show();
        flag = 1;
      } else if (this.population[i].isAlive && i % 2 == 0) {
        this.population[i].showGhostShip();
      }
    }
  }

  update() {
    for (let i = 0; i < this.populationSize; i++) {
      if (this.population[i].isAlive) {
        this.population[i].update();
      } else if (!this.deadMembers.includes(this.population[i])) {
        this.deadMembers.push(this.population[i]);
        this.fitness[i] = 0;
        this.fitnessLifetime[i] = this.deadMembers.length;
        this.fitnessKill[i] = this.population[i].killCount;
        this.fitnessLaser[i] = this.population[i].laserAmount;
        this.fitnessMove[i] = this.population[i].moveAmount;
      }
    }

    if (this.deadMembers.length == this.populationSize) {
      this.calculateFitness();
      let newPopulation = [];
      for (let i = 0; i < this.populationSize; i++) {
        let x = this.randomSelect();
        let y = this.randomSelect();

        let children = this.reproduce(x, y);

        if (random() < 0.05) {
          this.mutate(children.child1);
        }

        if (random() < 0.05) {
          this.mutate(children.child2);
        }
        newPopulation.push(children.child1);
        newPopulation.push(children.child2);
      }
      this.population = newPopulation;
      this.deadMembers = [];
      this.fitness = [];
      this.fitnessLifetime = [];
      this.fitnessKill = [];
      this.fitnessLaser = [];
      this.fitnessMove = [];
      this.generation++;
    }
  }

  calculateFitness() {
    let lifetimeScore = 0;
    let killScore = 0;
    let laserScore = 0;
    let moveScore = 0;

    let maxKill = 0;
    let maxLaser = 0;
    let maxMove = 0;
    for (let i = 0; i < this.fitness.length; i++) {
      if (this.fitnessKill[i] > maxKill) {
        maxKill = this.fitnessKill[i];
      }
      if (this.fitnessLaser[i] > maxLaser) {
        maxLaser = this.fitnessLaser[i];
      }
      if (this.fitnessMove[i] > maxMove) {
        maxMove = this.fitnessMove[i];
      }
    }

    let sumTotal = 0;
    let sumKill = 0;
    let sumLaser = 0;
    let sumMove = 0;
    let max = 0;
    let maxIndex = 0;
    for (let i = 0; i < this.fitness.length; i++) {
      lifetimeScore = this.fitnessLifetime[i] / this.fitnessLifetime.length;
      killScore = this.fitnessKill[i] / (maxKill + 0.001);
      laserScore = 1 - this.fitnessLaser[i] / (maxLaser + 0.001);
      moveScore = this.fitnessMove[i] / (maxMove + 0.001);
      this.fitness[i] =
        lifetimeScore * 0.0 + killScore * 0 + laserScore * 0 + moveScore * 1.0;
      //sumTotal += this.fitness[i];
      //sumKill += killScore;
      //sumLaser += laserScore;
      //sumMove += moveScore;
      sumKill += this.fitnessKill[i];
      sumLaser += this.fitnessLaser[i];
      sumMove += this.fitnessMove[i];
      if (this.fitness[i] > max) {
        max = this.fitness[i];
        maxIndex = i;
      }
    }
    console.log(
      "kill / laser / move / average = ",
      sumKill / this.fitness.length,
      sumLaser / this.fitness.length,
      sumMove / this.fitness.length
      //sumTotal / this.fitness.length
    );
    console.log(
      "k / l / m / f = ",
      this.fitnessKill[maxIndex],
      this.fitnessLaser[maxIndex],
      this.fitnessMove[maxIndex]
      //this.fitnessKill[maxIndex] / (maxKill + 0.001),
      //1 - this.fitnessLaser[maxIndex] / (maxLaser + 0.001),
      //this.fitnessMove[maxIndex] / (maxMove + 0.001),
      //max
    );
  }

  sortFitnessAndPopulation() {
    let key;
    let key2;
    let i;
    for (let j = 1; j < this.fitness.length; j++) {
      key = this.fitness[j];
      key2 = this.population[j];
      i = j - 1;
      while (i >= 0 && this.fitness[i] > key) {
        this.fitness[i + 1] = this.fitness[i];
        this.fitness[i] = key;

        this.population[i + 1] = this.population[i];
        this.population[i] = key2;

        i--;
      }
    }

    let tmp = (this.fitness.length * (this.fitness.length + 1)) / 2;
    for (let i = 0; i < this.fitness.length; i++) {
      this.fitness[i] = (i + 1) / tmp;
    }
  }

  randomSelect() {
    let rn = random();
    let temp = 0;
    let index = 0;

    this.sortFitnessAndPopulation();

    while (temp < rn) {
      temp += this.fitness[index];
      index++;
    }
    index--;

    return this.population[index];
  }

  reproduce(x, y) {
    let xnn = x.neuralNetwork;
    let ynn = y.neuralNetwork;
    let nn1 = new NeuralNetwork();
    let nn2 = new NeuralNetwork();

    let rng;
    for (let i = 0; i < 16; i++) {
      rng = floor(random(12));
      rng = 6;
      for (let j = 0; j < 12; j++) {
        if (i < rng) {
          nn1.inputNeurons[i].weights[j] =
            xnn.inputNeurons[i].weights[j] * 0.8 +
            ynn.inputNeurons[i].weights[j] * 0.2;
          nn2.inputNeurons[i].weights[j] =
            ynn.inputNeurons[i].weights[j] * 0.8 +
            xnn.inputNeurons[i].weights[j] * 0.2;
        } else {
          nn1.inputNeurons[i].weights[j] =
            ynn.inputNeurons[i].weights[j] * 0.8 +
            xnn.inputNeurons[i].weights[j] * 0.2;
          nn2.inputNeurons[i].weights[j] =
            xnn.inputNeurons[i].weights[j] * 0.8 +
            ynn.inputNeurons[i].weights[j] * 0.2;
        }
      }
    }

    for (let i = 0; i < 12; i++) {
      rng = floor(random(12));
      rng = 6;
      for (let j = 0; j < 12; j++) {
        if (i < rng) {
          nn1.hiddenNeurons1[i].weights[j] =
            xnn.hiddenNeurons1[i].weights[j] * 0.8 +
            ynn.hiddenNeurons1[i].weights[j] * 0.2;
          nn2.hiddenNeurons1[i].weights[j] =
            ynn.hiddenNeurons1[i].weights[j] * 0.8 +
            xnn.hiddenNeurons1[i].weights[j] * 0.2;
        } else {
          nn1.hiddenNeurons1[i].weights[j] =
            ynn.hiddenNeurons1[i].weights[j] * 0.8 +
            xnn.hiddenNeurons1[i].weights[j] * 0.2;
          nn2.hiddenNeurons1[i].weights[j] =
            xnn.hiddenNeurons1[i].weights[j] * 0.8 +
            ynn.hiddenNeurons1[i].weights[j] * 0.2;
        }
      }
    }

    for (let i = 0; i < 12; i++) {
      rng = floor(random(5));
      rng = 3;
      for (let j = 0; j < 5; j++) {
        if (i < rng) {
          nn1.hiddenNeurons2[i].weights[j] =
            xnn.hiddenNeurons2[i].weights[j] * 0.8 +
            ynn.hiddenNeurons2[i].weights[j] * 0.2;
          nn2.hiddenNeurons2[i].weights[j] =
            ynn.hiddenNeurons2[i].weights[j] * 0.8 +
            xnn.hiddenNeurons2[i].weights[j] * 0.2;
        } else {
          nn1.hiddenNeurons2[i].weights[j] =
            ynn.hiddenNeurons2[i].weights[j] * 0.8 +
            xnn.hiddenNeurons2[i].weights[j] * 0.2;
          nn2.hiddenNeurons2[i].weights[j] =
            xnn.hiddenNeurons2[i].weights[j] * 0.8 +
            ynn.hiddenNeurons2[i].weights[j] * 0.2;
        }
      }
    }

    let child1 = new Game(
      this.spaceShipSize,
      this.asteroidAmount,
      this.asteroidSize,
      nn1
    );

    let child2 = new Game(
      this.spaceShipSize,
      this.asteroidAmount,
      this.asteroidSize,
      nn2
    );

    return { child1, child2 };
  }

  mutate(x) {
    let rng;
    let rng2;
    let rng3;
    let rng4;
    for (let i = 0; i < 5; i++) {
      rng = floor(random(16));
      rng2 = floor(random(12));
      for (let j = 0; j < 5; j++) {
        rng3 = floor(random(12));
        rng4 = floor(random(5));
        x.neuralNetwork.inputNeurons[rng].weights[rng3] = random(2) - 1;
        x.neuralNetwork.hiddenNeurons1[rng2].weights[rng3] = random(2) - 1;
        x.neuralNetwork.hiddenNeurons2[rng2].weights[rng4] = random(2) - 1;
      }
    }
  }
}
