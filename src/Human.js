import * as THREE from "../lib/three.module.js";
import Actor from "./Actor.js"
import ControleurCamera from "./ControleurCamera.js"
import Component from "./components/Component.js"
import { loadObj } from "./prims.js"

export default class Human extends Actor {

  constructor(sim, options = {}) {
    super(sim);
    this.setObjet3d(loadObj("human", "assets/obj/human/human.obj", "assets/obj/human/human.mtl"))
    this.objet3d.scale.set(0.02, 0.02, 0.02);

    this.camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.1, 1000.0);
    this.controleur = new ControleurCamera(this.scene, this.camera);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.sim.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Affectation de callbacks aux événements utilisateur
    document.addEventListener("keyup", (e) => this.controleur.keyUp(e), false);
    document.addEventListener("keydown", (e) => this.controleur.keyDown(e), false);
    document.addEventListener("mousemove", (e) => this.controleur.mouseMove(e), false);
    document.addEventListener("mousedown", (e) => this.controleur.mouseDown(e), false);

    // add behavior
    this.addComponent(HumanBehavior, this.camera, this.controleur);
  }
}

class HumanBehavior extends Component {

  constructor(actor, options = []) {
    super(actor);
    [this.camera, this.controleur] = options;
  }

  update(dt) {
    this.controleur.update(dt);
    this.actor.sim.renderer.render(this.actor.sim.scene, this.camera);
    this.actor.objet3d.position.set(this.controleur.position);
    this.actor.objet3d.lookAt(this.controleur.cible);
  }
}