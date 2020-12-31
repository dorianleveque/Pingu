import Component from "./Component.js";

export default class Hunger extends Component {
	constructor(actor, options = []) {
		super(actor);
		this.hunger = 100;
		this.hungryRate = 40;
		this.hungrySpeed = 0.05;
	}

	update(dt) {
		if (Math.random() < this.hungrySpeed) {
			this.hunger--;
		}
	}

	isHungry() {
		return this.hunger < this.hungryRate;
	}

	hasEaten() {
		this.hunger = 100;
	}
}
