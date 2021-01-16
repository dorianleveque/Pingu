export default class RegionTrigger {

  constructor(options = {}) {
    this.object3d = null;
    this.trigger = null;
    this.color = options.color || 0xffffff
    this.v = options.visible || false;
  }

  setTrigger(trigger) {
    this.trigger = trigger;
    this.visible = this.v;
    const parentMaterial = this.trigger.parent.object3d.material;
    if (parentMaterial) this.object3d.material.color = parentMaterial.color || 0xffffff
    this.trigger.parent.object3d.attach(this.object3d);
  }

  set visible(v) {
    if (this.object3d)
      this.object3d.visible = v;
  }

  get visible() {
    if (this.object3d)
      return this.object3d.visible;
  }

  /**
   * Test if observed position is in the area
   * @param {Vector3} observe observed position
   */
  test(observedPosition) {
    throw new Error('You must implement this function');
  }
}