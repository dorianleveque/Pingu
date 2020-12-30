import * as THREE from "../../lib/three.module.js";
import RegionTrigger from "./RegionTrigger.js";

class Trigger {

  constructor(parent, regionTriggerClass, regionTriggerOptions = {}, observedFilter = []) {
    this.parent = parent;
    this.setRegion(regionTriggerClass, regionTriggerOptions);
    this.observedFilter = observedFilter;
    this.observed = [];
    this.previousObserved = [];
  }

  diff(previousChanged, newChanged) {
    return {
      'enter': newChanged.filter(e => !previousChanged.includes(e)),
      'stay': newChanged.filter(e => previousChanged.includes(e)),
      'exit': previousChanged.filter(e => !newChanged.includes(e))
    }
  }

  setRegion(regionTriggerClass, options) {
    const region = new regionTriggerClass(options);
    if (region instanceof RegionTrigger) {
      this.region = region;
      this.region.setTrigger(this);
    }
    else throw new Error("Region must be a RegionTriggerClass");
  }

  /**
   * Eval and send notification to observers or observed depends on Area Type (Nimbus, Focus, Area)
   */
  eval() {
    if (this.observed.length > 0) {
      const inTrigger = [];
      this.observed.forEach(observed => {
        if (this.region.test(this.testOnObserved(observed))) {
          inTrigger.push(observed);
        }
      })

      // notify observers define by sub class
      Object.values(this.diff(this.previousObserved, inTrigger)).forEach((diffTypeList, index) => {
        diffTypeList.forEach(obs => {
          const { trigger, observer, observed } = this.notify(obs);
          switch(index) {
            case 0: observer.onTriggerEnter(trigger.constructor.name, observed, this.coef(obs)); break;
            case 1: observer.onTriggerStay(trigger.constructor.name, observed, this.coef(obs)); break;
            case 2: observer.onTriggerExit(trigger.constructor.name, observed, this.coef(obs)); break;
          }
        })
      })
      this.previousObserved = inTrigger;
    }
    else {
      this.observed = this.parent.sim.actors
        .filter(actor => actor != this.parent)
        .filter(actor => (this.observedFilter.length > 0) ? this.observedFilter.some(obs => actor instanceof obs) : true);
    }
  }

  coef(observed) {
    return 1 - (this.parent.position.distanceTo(observed.position) / this.region.radius);
  }

  /**
   * 
   * @param {Actor} observed observed actor
   * @return {THREE.Vector3}
   */
  testOnObserved(observed) {
    throw new Error('This function must be implemented');
  }


  notify(changed) {
    throw new Error('This function must be implemented');
  }

  /**
   * Observed element 
   * @param {ActorClass} observed actor observed
   */
  addObserved(observed) {
    if (this.findObserved(observed) == null) {
      this.observed.push(observed);
    }
  }

  findObserved(observed) {
    return this.observed.find(obs => obs === observed) || null;
  }

  removeObserved(observed) {
    const obs = this.findObserved(observed)
    if (obs != null) {
      this.observed.splice(this.observed.indexOf(obs), 1);
    }
  }
}

export class Nimbus extends Trigger {

  constructor(parent, regionTriggerClass, regionTriggerOptions, observedFilter = []) {
    super(parent, regionTriggerClass, regionTriggerOptions, observedFilter);
  }

  testOnObserved(observed) {
    return observed.position;
  }

  notify(observed) {
    return {
      'trigger': this,
      'observer': observed,
      'observed': this.parent
    }
  }

  coef(observed) {
    const d = 1 - (this.parent.position.distanceTo(observed.position) / this.region.radius);
    return Math.pow(d, 2);
  }
}

export class Focus extends Trigger {

  constructor(parent, regionTriggerClass, regionTriggerOptions, observedFilter = []) {
    super(parent, regionTriggerClass, regionTriggerOptions, observedFilter);
  }

  testOnObserved(observed) {
    return observed.position;
  }

  notify(observed) {
    return {
      'trigger': this,
      'observer': this.parent,
      'observed': observed
    }
  }

  coef(observed) {
    const d = 1 - (this.parent.position.distanceTo(observed.position) / this.region.radius);
    return Math.sqrt(d);
  }
}

export class Area extends Trigger {

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