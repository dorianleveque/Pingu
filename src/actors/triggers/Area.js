import * as THREE from "../../../lib/three.module.js";
import Trigger from './Trigger.js'

export default class Area extends Trigger {

  constructor(parent, regionTriggerClass, regionTriggerOptions, observedFilter = []) {
    super(parent, regionTriggerClass, regionTriggerOptions, observedFilter);
  }

  testOnObserved(observed) {
    const trigger = observed.getTrigger(Area);
    if (trigger) {
      const radius = trigger.region.radius;
      const dir = new THREE.Vector3();
      dir.subVectors(this.region.object3d.parent.position, observed.position);
      dir.divideScalar(dir.length()).multiplyScalar(radius);
      return observed.position.clone().add(dir)
    }
    else return false;
  }

  notify(observed) {
    return {
      'trigger': this,
      'observer': this.parent,
      'observed': observed
    }
  }
}