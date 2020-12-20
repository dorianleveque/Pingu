import Component from "./Component.js"
import { getRandCoord } from "../utils.js"

export default class RandomTarget extends Component {

  constructor(actor, options = []) {
    super(actor);
    const [generateWhenNoSpeed, xMin, xMax, zMin, zMax] = options;
    this.generateWhenNoSpeed = generateWhenNoSpeed || false;
    this.xMin = xMin || -Math.floor(this.actor.sim.groundWidth / 2);
    this.xMax = xMax || Math.floor(this.actor.sim.groundWidth / 2);
    this.zMin = zMin || -Math.floor(this.actor.sim.groundDepth / 2);
    this.zMax = zMax || Math.floor(this.actor.sim.groundDepth / 2);
  }

  update() {
    if (this.generateWhenNoSpeed) {
      if (Math.round(this.actor.velocity.length() * 100) == 0 || this.actor.isOutOfGround()) {
        this.newTarget();
      }
    }
    else {
      if (this.actor.acceleration.length() == 0 && (this.actor.isOutOfGround() || Math.random() < 0.01)) {
        this.newTarget();
      } 
    }
  }
  
  newTarget() {
    const [x, z] = getRandCoord(this.xMin, this.xMax, this.zMin, this.zMax);
    this.actor.target.set(x, 0, z);
  }
}