import RegionTrigger from "./RegionTrigger.js"
import { createSphere } from "../../../Prims.js"

export default class RegionTriggerSphere extends RegionTrigger {

  constructor(options = {}) {
    super(options);
    this.radius = options.radius || 0;
    this.object3d = createSphere(this.radius, 15, 15, this.color, 0.5, true);
  }

  /**
   * Test if observed position is in the area
   * @param {Vector3} observe observed position
   */
  test(observedPosition) {
    return (this.object3d.parent.position.distanceToSquared(observedPosition)) < Math.pow(this.radius, 2);
  }
}