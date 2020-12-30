import { Vector3 } from "../../lib/three.module.js";
import { createCylinder } from "../prims.js";
import RegionTrigger from "./RegionTrigger.js"

export default class RegionTriggerCylinder extends RegionTrigger {

  constructor(options = {}) {
    super(options);
    this.radius = options.radius || 0;
    this.height = options.height || 0;
    this.object3d = createCylinder(this.radius, this.height, 15, 15, false, 0, 2 * Math.PI, this.color, 0.5, true)
  }

  /**
   * Test if observed position is in the area
   * @param {Vector3} observe observed position
   */
  test(observedPosition) {
    return (Math.pow(observedPosition.x - this.object3d.parent.position.x, 2) + Math.pow(observedPosition.z - this.object3d.parent.position.z, 2)) < Math.pow(this.radius, 2) && Math.abs(observedPosition.y - this.object3d.parent.position.y) < this.height / 2;
  }
}