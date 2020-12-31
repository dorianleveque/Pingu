import * as THREE from "../../../lib/three.module.js";
import Component from "./Component.js"

export class Cohesion extends Component {
  constructor(actor, options = []) {
    super(actor);
    [this.penguins] = options;
  }

  update(dt) {
    const penguinsPositionSumed = new THREE.Vector3();

    this.penguins.forEach(penguin => penguinsPositionSumed.add(penguin.position));
    this.actor.target = penguinsPositionSumed;
  }
}

export class Separation extends Component {
  constructor(actor, options = []) {
    super(actor);
    const [penguins, coef] = options;
    this.penguins = penguins;
    this.coef = coef || 0.1;
  }

  update(dt) {
    if (this.penguins.length > 0) {
      const penguinsPositionSumed = new THREE.Vector3();

      this.penguins.forEach(penguin => {
        const PiP = new THREE.Vector3()
        PiP.subVectors(this.actor.position, penguin.position)
        PiP.divideScalar(PiP.length())
        penguinsPositionSumed.add(PiP)
      });

      const Fs = penguinsPositionSumed.multiplyScalar(this.coef / this.penguins.length);
      this.actor.applyForce(Fs);
    }
  }
}

export class Alignment extends Component {
  constructor(actor, options = []) {
    super(actor)
    const [penguins, coef] = options;
    this.penguins = penguins;
    this.coef = coef || 0.1;
  }

  update(dt) {
    if (this.penguins.length > 0) {
      const ViSumed = new THREE.Vector3();
  
      this.penguins.forEach(penguin => ViSumed.add(penguin.velocity));
  
      const Vm = ViSumed.divideScalar(this.penguins.length);
      const Fa = Vm.clone().sub(this.actor.velocity).multiplyScalar(this.coef);
      this.actor.applyForce(Fa);
    }
  }
}