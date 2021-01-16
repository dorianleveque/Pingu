import * as THREE from "../../../lib/three.module.js";
import RegionTrigger from "./regions/RegionTrigger.js";

export default class Trigger {

  constructor(parent, regionTriggerClass, regionTriggerOptions = {}, observedFilter = []) {
    this.parent = parent;
    this.setRegion(regionTriggerClass, regionTriggerOptions);
    this.observedFilter = observedFilter;
    this.observed = [];
    this.previousObserved = [];
  }

  /**
   * List the changes between the previous ones observed and the new ones observed.
   * @param {Array} previousChanged array of actors
   * @param {Array} newChanged array of actors
   */
  diff(previousChanged, newChanged) {
    return {
      'enter': newChanged.filter(e => !previousChanged.includes(e)),
      'stay': newChanged.filter(e => previousChanged.includes(e)),
      'exit': previousChanged.filter(e => !newChanged.includes(e))
    }
  }

  /**
   * Set the detection field
   * @param {RegionTrigger} regionTriggerClass RegionTrigger class
   * @param {Object} options options
   */
  setRegion(regionTriggerClass, options = {}) {
    const region = new regionTriggerClass(options);
    if (region instanceof RegionTrigger) {
      this.region = region;
      this.region.setTrigger(this);
    }
    else throw new Error("Region must be a RegionTrigger class");
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
          switch (index) {
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

  /**
   * Return a percentage of the distance between the observed position and the center position of the field.
   * More the value is greater, more the observed actor is near the center of the field.
   * Can be redefined.
   * @param {Actor} observed observed actor
   */
  coef(observed) {
    return 1 - (this.parent.position.distanceTo(observed.position) / this.region.radius);
  }

  /**
   * Operation done during the position test of the observed object.
   * Can be redefined.
   * @param {Actor} observed observed actor
   * @return {THREE.Vector3} position of the observed
   */
  testOnObserved(observed) {
    return observed.position;
  }

  /**
   * Must be redefined to return an object describing the observer to be notified, the type of trigger used and the object observed.
   * @param {Actor} changed observed actor
   * @example return {
   *  "trigger": this,
   *  "observer": observed,
      "observed": this.parent
   * }
   */
  notify(observed) {
    throw new Error('This function must be implemented');
  }

  /**
   * Add an observed element 
   * @param {Actor} observed actor observed
   */
  addObserved(observed) {
    if (this.findObserved(observed) == null) {
      this.observed.push(observed);
    }
  }

  /**
   * Find the actor and send him back or send back null if not found.
   * @param {Actor} observed actor observed
   */
  findObserved(observed) {
    return this.observed.find(obs => obs === observed) || null;
  }

  /**
   * Remove the actor specified
   * @param {Actor} observed actor observed
   */
  removeObserved(observed) {
    const obs = this.findObserved(observed)
    if (obs != null) {
      this.observed.splice(this.observed.indexOf(obs), 1);
    }
  }
}





