import * as THREE from "../../../lib/three.module.js";
import Component from "./Component.js"

export class AbruptDeparture extends Component {

  constructor(actor, options = []) {
    super(actor);
    const [v0, d0] = options;
    this.v0 = v0 || 80;
    this.d0 = d0 || 5;
  }

  update(dt) {
    const PC = new THREE.Vector3();
    PC.subVectors(this.actor.target, this.actor.position);
    const d = PC.length();
    this.actor.velocityMax = (d > this.d0) ? this.v0 : this.v0 * (this.d0 - d + 1);
  }
}


export class Arrive extends Component {

  constructor(actor, options = []) {
    super(actor);
    const [v0, d0min, d0max] = options;
    this.v0 = v0 || 8;
    this.d0min = d0min || 0.8;
    this.d0max = d0max || 5;
  }

  update(dt) {
    const PC = new THREE.Vector3();
    PC.subVectors(this.actor.target, this.actor.position);
    const d = PC.length();
    this.actor.velocityMax = (d > this.d0max) ? this.v0 : (d > this.d0min) ? this.v0 * ((d - this.d0min) / this.d0max) : 0.00001;
  }
}
