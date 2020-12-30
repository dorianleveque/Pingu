import * as THREE from "../../lib/three.module.js";
import Component from "./Component.js"

export default class Awarness extends Component {

  constructor(actor, options = []) {
    super(actor);
    this.inFocus = {};
    this.inNimbus = {};
    this.awarness = [];
    this.focusCoef = 0.6;
    this.nimbusCoef = 0.4;
  }

  update(dt) {
    //console.log(this.inFocus)
    const awarness = {};
    Object.keys(this.inFocus).forEach(actorID => awarness[actorID] = this.focusCoef * this.inFocus[actorID]);
    Object.keys(this.inNimbus).forEach(actorID => awarness[actorID] += this.nimbusCoef * this.inNimbus[actorID]);

    this.awarness = this.actor.sim.actors.map(actor => Object.create({ actor, 'awarness': awarness[Object.id(actor)] }) );
  }

  addInFocus(actor, coef) {
    this.inFocus[Object.id(actor)] = coef;// .push({'actor': actor, 'coef': coef});
  }

  updateInFocus(actor, coef) {
    //const index = this.inFocus.findIndex(o => o.actor == actor);
    //this.inFocus[index].coef = coef;
    this.inFocus[Object.id(actor)] = coef;
  }

  removeInFocus(actor) {
    //const index = this.inFocus.findIndex(o => o.actor == actor);
    //this.inFocus.splice(index, 1);
    delete this.inFocus[Object.id(actor)];
  }

  addInNimbus(actor, coef) {
    //this.inFocus.push({'actor': actor, 'coef': coef});
    this.inNimbus[Object.id(actor)] = coef;
  }

  updateInNimbus(actor, coef) {
    //const index = this.inFocus.findIndex(o => o.actor == actor);
    //this.inFocus[index].coef = coef;
    this.inNimbus[Object.id(actor)] = coef;
  }

  removeInNimbus(actor) {
    //const index = this.inFocus.findIndex(o => o.actor == actor);
    //this.inFocus.splice(index, 1);
    delete this.inNimbus[Object.id(actor)];
  }

  get() {
    return this.awarness;
  }
}
