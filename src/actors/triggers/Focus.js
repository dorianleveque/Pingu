import Trigger from './Trigger.js'

export default class Focus extends Trigger {

  constructor(parent, regionTriggerClass, regionTriggerOptions, observedFilter = []) {
    super(parent, regionTriggerClass, regionTriggerOptions, observedFilter);
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