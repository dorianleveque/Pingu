import Component from "./Component.js"
import { getRandCoord } from "../../Utils.js"
import * as THREE from "../../../lib/three.module.js";

export default class RandomTarget extends Component {

  constructor(actor, options = []) {
    super(actor);
    const [generateWhenNoSpeed, xMin, xMax, zMin, zMax] = options;
    this.generateWhenNoSpeed = generateWhenNoSpeed || false;
    this.xMin = xMin || -Math.floor(this.actor.sim.groundWidth / 2);
    this.xMax = xMax || Math.floor(this.actor.sim.groundWidth / 2);
    this.zMin = zMin || -Math.floor(this.actor.sim.groundDepth / 2);
    this.zMax = zMax || Math.floor(this.actor.sim.groundDepth / 2);
    this.generate();
  }

  update() {
    if (this.generateWhenNoSpeed) {
      if (Math.round(this.actor.velocity.length() * 100) == 0 || this.actor.isOutOfGround()) {
        this.generate();
      }
    }
    else {
      if (Math.round(this.actor.acceleration.length()) == 0 && (this.actor.isOutOfGround() || Math.random() < 0.01)) {
        this.generate();
      }
    }
  }

  generate() {
    const [x, z] = getRandCoord(this.xMin, this.xMax, this.zMin, this.zMax);
    this.actor.target = new THREE.Vector3(x, 0, z);
  }
}