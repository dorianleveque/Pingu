import Trigger from './Trigger.js'

export default class Nimbus extends Trigger {

  constructor(parent, regionTriggerClass, regionTriggerOptions, observedFilter = []) {
    super(parent, regionTriggerClass, regionTriggerOptions, observedFilter);
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