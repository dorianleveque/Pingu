import * as THREE from "../../../lib/three.module.js";
import { Penguin, PenguinReynolds } from "../index.js";
import Component from "./Component.js"

export class Cohesion extends Component {
  constructor(actor, options = []) {
    super(actor);
    [this.inFocus] = options;
  }

  update(dt) {
    const penguinsPositionSumed = new THREE.Vector3();

    this.inFocus.filter(e => e instanceof Penguin).forEach(penguin => penguinsPositionSumed.add(penguin.position));
    this.actor.target = penguinsPositionSumed;
  }
}

export class Separation extends Component {
  constructor(actor, options = []) {
    super(actor);
    const [inFocus, coef] = options;
    this.inFocus = inFocus;
    this.coef = coef || 5;
  }

  update(dt) {
    const penguins = this.inFocus.filter(e => e instanceof Penguin || e instanceof PenguinReynolds)
    if (penguins.length > 0) {
      const penguinsPositionSumed = new THREE.Vector3();

      penguins.forEach(penguin => {
        const PiP = new THREE.Vector3()
        PiP.subVectors(this.actor.position, penguin.position)
        PiP.divideScalar(PiP.length())
        penguinsPositionSumed.add(PiP)
      });

      const Fs = penguinsPositionSumed.multiplyScalar(this.coef / penguins.length);
      this.actor.applyForce(Fs);
    }
  }
}

export class Alignment extends Component {
  constructor(actor, options = []) {
    super(actor)
    const [inFocus, coef] = options;
    this.inFocus = inFocus;
    this.coef = coef || 5;
  }

  update(dt) {
    const penguins = this.inFocus.filter(e => e instanceof Penguin || e instanceof PenguinReynolds)
    if (penguins.length > 0) {
      const ViSumed = new THREE.Vector3();
  
      penguins.forEach(penguin => ViSumed.add(penguin.velocity));
  
      const Vm = ViSumed.divideScalar(penguins.length);
      const Fa = Vm.clone().sub(this.actor.velocity).multiplyScalar(this.coef);
      this.actor.applyForce(Fa);
    }
  }
}