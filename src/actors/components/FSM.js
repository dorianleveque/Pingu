import Component from "./Component.js"

export default class FSM extends Component {

  constructor(actor, options = []) {
    super(actor);
    [this.states, this.currentState] = options;
    this.transition(this.currentState);
  }

  get state() {
    return this.currentState;
  }

  transition(state) {
    const oldState = this.states[this.currentState];
    if (oldState && oldState.exit) oldState.exit.call(this);
    this.currentState = state;
    const newState = this.states[state];
    if (newState && newState.enter) newState.enter.call(this);
  }

  update(dt) {
    const state = this.states[this.currentState];
    if (state.update) state.update.call(this, dt);
    //console.log(this.currentState)
  }

}