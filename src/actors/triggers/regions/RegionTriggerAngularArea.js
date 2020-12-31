import * as THREE from "../../../../lib/three.module.js";
import { createCylinder } from "../../../Prims.js"
import RegionTrigger from "./RegionTrigger.js"

export default class RegionTriggerAngularArea extends RegionTrigger {

  constructor(options = {}) {
    super(options);
    this.radius = options.radius || 0;
    this.height = options.height || 0;
    this.theta = options.theta || Math.PI / 3;
    this.thetaStart = this.theta / 2;
    this.object3d = createCylinder(this.radius, this.height, 15, 15, false, -this.thetaStart, this.theta, this.color, 0.5, true)
  }

  /**
   * Test if observed position is in the area
   * @param {Vector3} observe observed position
   */
  test(observedPosition) {
    const PO = new THREE.Vector3();
    PO.subVectors(observedPosition.clone(), this.object3d.parent.position);

    const direction = new THREE.Vector3(0, 0, 1);
    direction.applyQuaternion(this.object3d.parent.quaternion);
    const angle = direction.angleTo(PO.clone().divideScalar(PO.length()))

    return PO.length() <= this.radius && angle <= this.theta / 2 && Math.abs(observedPosition.y - this.object3d.parent.position.y) <= this.height / 2;
  }
}