class NeuralNetwork {
  constructor() {
    this.inputNeurons = [];
    this.hiddenNeurons1 = [];
    this.hiddenNeurons2 = [];
    this.outputNeurons = [];

    for (let i = 0; i < 16; i++) {
      this.inputNeurons.push(new Neuron(12));
    }

    for (let i = 0; i < 12; i++) {
      this.hiddenNeurons1.push(new Neuron(12));
      this.hiddenNeurons2.push(new Neuron(5));
    }

    for (let i = 0; i < 5; i++) {
      this.outputNeurons.push(new Neuron());
    }
  }

  findAction(inputs) {
    //return 5;
    //console.log(inputs);
    for (let i = 0; i < this.inputNeurons.length; i++) {
      this.inputNeurons[i].setValue(inputs[i]);
    }

    for (let i = 0; i < this.hiddenNeurons1.length; i++) {
      let value = 0;
      for (let j = 0; j < this.inputNeurons.length; j++) {
        value +=
          this.inputNeurons[j].weights[i] * this.inputNeurons[j].currentValue;
      }
      //value = this.customActivation(value);
      value = this.reluActivation(value);
      this.hiddenNeurons1[i].setValue(value);
    }

    for (let i = 0; i < this.hiddenNeurons2.length; i++) {
      let value = 0;
      for (let j = 0; j < this.hiddenNeurons1.length; j++) {
        value +=
          this.hiddenNeurons1[j].weights[i] *
          this.hiddenNeurons1[j].currentValue;
      }
      //value = this.customActivation2(value);
      value = this.reluActivation(value);
      this.hiddenNeurons2[i].setValue(value);
    }

    let indice = 0;
    let max = 0;
    for (let i = 0; i < this.outputNeurons.length; i++) {
      let value = 0;
      for (let j = 0; j < this.hiddenNeurons2.length; j++) {
        value +=
          this.hiddenNeurons2[j].weights[i] *
          this.hiddenNeurons2[j].currentValue;
      }
      //value = this.reluActivation(value);
      value = this.sigmoidActivation(value);
      this.outputNeurons[i].setValue(value);
      if (value > max) {
        indice = i;
        max = value;
      }
    }

    return indice;
  }

  customActivation(value) {
    //if (random(100) < 10) console.log(value);
    return value > 2 ? 1 : 0;
  }

  customActivation2(value) {
    return value > 5 ? 1 : 0;
  }

  sigmoidActivation(value) {
    return 1.0 / (1.0 + Math.pow(Math.E, -value));
  }

  reluActivation(value) {
    return Math.max(0, value);
  }
}

class Neuron {
  constructor(weightAmount) {
    this.currentValue = 0;
    this.weights = [];
    if (weightAmount) {
      for (let i = 0; i < weightAmount; i++) {
        this.weights.push(random(2) - 1);
      }
    }
  }

  setValue(value) {
    this.currentValue = value;
  }
}
