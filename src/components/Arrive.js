import * as THREE from "../../lib/three.module.js";
import Component from "./Component.js"

export default class Arrive extends Component {

  constructor(actor, options = []) {
    super(actor)
    const [d0, v0] = options;
    this.v0 = v0 || 5;
    this.d0 = d0 || 5
  }

  update(dt) {
    const PC = new THREE.Vector3();
		PC.subVectors(this.actor.target, this.actor.position);
    const d = PC.length();
    this.actor.velocityMax = (d > this.d0) ? this.v0 : (this.v0/this.d0)*d 
  }
}
