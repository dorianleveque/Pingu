import Component from "./Component.js"
import Pheromone from "../Pheromone.js"

export default class ReleasePheromone extends Component {

  constructor(actor, options = []) {
    super(actor);
    const [randomRange] = options;
    this.randomRange = randomRange || 0.02;
    this.triggerVisible = false;
  }

  update() {
    if (Math.random() < this.randomRange) {
      const pheromone = new Pheromone(this.actor.sim, this.actor, { 'triggerVisible': this.triggerVisible });
      pheromone.position = this.actor.position;
      this.actor.sim.addActor(pheromone);
    }
  }
}