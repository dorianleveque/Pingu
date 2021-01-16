import { Actor, Penguin, Components, Triggers, Rock } from "./index.js"
import { loadObj } from "../Prims.js"

export default class BabyPenguin extends Actor {

  constructor(sim, options = {}) {
    super(sim, options.mass);
    this.setObject3d(loadObj("tux1", "assets/obj/pingouin/penguin.obj", "assets/obj/pingouin/penguin.mtl"));
    this.object3d.scale.set(0.7, 0.7, 0.7);
    this.inFocus = [];

    this.addComponent(Components.Cohesion, this.inFocus);
    this.addComponent(Components.Separation, this.inFocus);
    this.addComponent(Components.Alignment, this.inFocus);
    this.addComponent(Components.Arrive, 8, 1.5);
    this.addComponent(Components.Seek);
    this.addComponent(Components.ObstacleAvoidance, this.inFocus);
    this.setTrigger(Triggers.Focus, Triggers.Regions.AngularArea, { radius: 6, height: 2, theta: 10 * Math.PI / 6 }, [Penguin, BabyPenguin, Rock]);
  }

  // Triggers Event
  onTriggerEnter(type, observed) {
    switch (type) {
      case "Focus": this.inFocus.push(observed); break;
    }
  }

  onTriggerExit(type, observed) {
    switch (type) {
      case "Focus": this.inFocus.splice(this.inFocus.indexOf(observed), 1); break;
    }
  }
}