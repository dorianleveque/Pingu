import * as THREE from "../../lib/three.module.js";
import ControleurCamera from "../../lib/ControleurCamera.js"
import { Actor, Components, Grass, Penguin, BabyPenguin, Pheromone, Triggers } from "./index.js"
import { loadObj } from "../Prims.js"

export default class Human extends Actor {

  constructor(sim, options = {}) {
    super(sim);
    this.setObject3d(loadObj("human", "assets/obj/human/human.obj", "assets/obj/human/human.mtl"))
    this.object3d.scale.set(0.001, 0.001, 0.001);

    this.camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.1, 1000.0);
    this.controleur = new ControleurCamera(this.scene, this.camera);
    this.keys = new Array(10).fill(false);
    this.previousNumkeysState = this.keys.slice();

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.sim.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Affectation de callbacks aux événements utilisateur
    document.addEventListener("keyup", (e) => {this.controleur.keyUp(e); this.keyUp(e)}, false);
    document.addEventListener("keydown", (e) => this.controleur.keyDown(e), false);
    document.addEventListener("mousemove", (e) => this.controleur.mouseMove(e), false);
    document.addEventListener("mousedown", (e) => this.controleur.mouseDown(e), false);

    this.setTrigger(Triggers.Nimbus, Triggers.Regions.Sphere, { radius: 15 }, [Penguin])

    this.helpTextElement = document.createElement("span");
    this.helpTextElement.id = "helpKeysControllerBox";
    this.helpTextElement.innerHTML = "Press h for help";
    document.body.appendChild(this.helpTextElement);
  }

  update(dt) {
    this.controleur.update(dt);
    this.sim.renderer.render(this.sim.scene, this.camera);
    this.position = this.controleur.position;
    this.object3d.position.setComponent(1, 0)
    this.object3d.lookAt(this.controleur.cible.clone().setComponent(1, 0));

    const diff = this.numkeysDiff();
    if (diff.length > 0) {
      this.previousNumkeysState = this.keys.slice();
      this.displayTrigger(diff);
    }
  }

  numkeysDiff() {
    const diff = []
    this.previousNumkeysState.forEach((value, index) => {
      if (value != this.keys[index]) diff.push(index);
    })
    return diff;
  }

  displayTrigger(diff) {
    let stop = false;
    for (let index of diff) {
      const v = this.keys[index]
      switch (index) {
        case 0: this.keys = this.keys.map(num => this.keys[0]); stop = true; break;
        case 1: this.sim.triggers.filter(trig => trig.parent instanceof Human).forEach(trig => trig.region.visible = v); break;
        case 2: this.sim.triggers.filter(trig => trig.parent instanceof Penguin).forEach(trig => trig.region.visible = v); break;
        case 3: this.sim.triggers.filter(trig => trig.parent instanceof BabyPenguin).forEach(trig => trig.region.visible = v); break;
        case 4: this.sim.triggers.filter(trig => trig.parent instanceof Grass).forEach(trig => trig.region.visible = v); break;
        case 5:
          this.sim.triggers.filter(trig => trig.parent instanceof Pheromone).forEach(trig => trig.region.visible = v);
          this.sim.actors.filter(actor => actor instanceof Penguin).forEach(actor => actor.getComponent(Components.ReleasePheromone).triggerVisible = v);
          break;
      }
      if (stop) break;
    }
  }

  keyUp(event) {
    switch (event.key.toLocaleLowerCase()) {
      case '0': // key NUMPAD 0
        this.keys[0] = !this.keys[0];
        break;
      case '1': // key NUMPAD 1
        this.keys[1] = !this.keys[1];
        break;
      case '2': // key NUMPAD 2
        this.keys[2] = !this.keys[2];
        break;
      case '3': // key NUMPAD 3
        this.keys[3] = !this.keys[3];
        break;
      case '4': // key NUMPAD 4
        this.keys[4] = !this.keys[4];
        break;
      case '5': // key NUMPAD 5
        this.keys[5] = !this.keys[5];
        break;
      case '6': // key NUMPAD 6
        this.keys[6] = !this.keys[6];
        break;
      case '7': // key NUMPAD 7
        this.keys[7] = !this.keys[7];
        break;
      case '8': // key NUMPAD 8
        this.keys[8] = !this.keys[8];
        break;
      case '9': // key NUMPAD 9
        this.keys[9] = !this.keys[9];
        break;
      case 'h': // key Help
        this.keys[10] = !this.keys[10];
        this.helpTextElement.innerHTML = (this.keys[10]) ? "<b>Keys:</b> <u>Move</u> Press(⏴⏵⏶⏷) | <b>Display Trigger Area</b> <u>All</u> Press '0' - <u>Human</u> Press '1' - <u>Penguin</u> Press '2' - <u>BabyPenguin</u> Press '3' - <u>Grass</u> Press '4' - <u>Pheromone</u> Press '5'" 
        : "Press h for help";
        break;
    }
  }
}