import Trigger from "../triggers/Trigger.js";

export default class Focus extends Trigger {

  constructor(object3d, region) {
    super(object3d, region);
    this.previousObserved = [];
  }

  eval() {
    this.init();

    const inFocus = [];
    this.observed.forEach(observed => {
      const result = this.region.test(observed);
      if (result != null) {
        inFocus.push(result);
      }
    })

    const { enter, stay, exit } = this.diff(this.previousObserved, inFocus);
    enter.forEach(e => this.parent.onTriggerEnter(this, e));
    stay.forEach(e => this.parent.onTriggerStay(this, e));
    exit.forEach(e => this.parent.onTriggerExit(this, e));

    this.previousObserved = inFocus;
  }
}