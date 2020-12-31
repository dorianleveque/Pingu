import Component from "./Component.js"
import { average } from "../../Utils.js"

export default class Awareness extends Component {

  constructor(actor, options = []) {
    super(actor);
    this.inFocus = {};
    this.inNimbus = {};
    this.awareness = [];
    this.focusCoef = 0.8;
    this.nimbusFocusRateMax = 1;
    this.nimbusFocusRateMin = 0.67;
    this.focusRateMax = 0.66;
    this.focusRateMin = 0.34;
    this.nimbusRateMax = 0.33;
    this.nimbusRateMin = 0;
  }

  update(dt) {
    const awareness = {};
    Object.keys(this.inFocus).forEach(actorID => {
      const focusValue = this.inFocus[actorID];
      const nimbusValue = this.inNimbus[actorID] || 0;

      if (nimbusValue > 0) { // nimbus + focus
        delete this.inNimbus[actorID];
        awareness[actorID] = (this.nimbusFocusRateMax - this.nimbusFocusRateMin) * average(focusValue, nimbusValue) + this.nimbusFocusRateMin;
      }
      // focus only
      else awareness[actorID] = (this.focusRateMax - this.focusRateMin) * focusValue + this.focusRateMin;
    });

    Object.keys(this.inNimbus).forEach(actorID => awareness[actorID] = (this.nimbusRateMax - this.nimbusRateMin) * this.inNimbus[actorID] + this.nimbusRateMin);

    this.awareness = []
    this.actor.sim.actors.forEach(actor => {
      if (awareness.hasOwnProperty(Object.id(actor))) {
        this.awareness.push({ actor, 'awareness': awareness[Object.id(actor)] });
      }
    })
  }

  addInFocus(actor, coef) {
    this.inFocus[Object.id(actor)] = coef;
  }

  updateInFocus(actor, coef) {
    this.inFocus[Object.id(actor)] = coef;
  }

  removeInFocus(actor) {
    delete this.inFocus[Object.id(actor)];
  }

  addInNimbus(actor, coef) {
    this.inNimbus[Object.id(actor)] = coef;
  }

  updateInNimbus(actor, coef) {
    this.inNimbus[Object.id(actor)] = coef;
  }

  removeInNimbus(actor) {
    delete this.inNimbus[Object.id(actor)];
  }

  /**
   * Return all awareness found ordered in descending order 
   * @param {Boolean} reverse if true, ordered in ascending order
   */
  getAll(reverse = false) {
    return this.awareness.sort((a, b) => (reverse) ? a.awareness - b.awareness : b.awareness - a.awareness);
  }

  /**
   * Return the first nearest found or null if not found.
   * @param {Actor} actorClass class of actor
   */
  getNearest(actorClass) {
    return this.getAll().find(e => e.actor instanceof actorClass) || null;
  }

  /**
   * Return the first farthest found or null if not found.
   * @param {Actor} actorClass class of actor
   */
  /*getFarthest(actorClass) {
    return this.getAll(true).find(e => e.actor instanceof actorClass) || null;
  }*/
}
