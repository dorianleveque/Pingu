import * as THREE from "../lib/three.module.js";
import Actor from "./Actor.js"
import ControleurCamera from "./ControleurCamera.js"
import { loadObj } from "./prims.js"
import { Nimbus } from "./triggers/Trigger.js";
import Penguin from "./Penguin.js";
import RegionTriggerSphere from "./triggers/RegionTriggerSphere.js";

export default class Human extends Actor {

  constructor(sim, options = {}) {
    super(sim);
    this.setObject3d(loadObj("human", "assets/obj/human/human.obj", "assets/obj/human/human.mtl"))
    this.object3d.scale.set(0.001, 0.001, 0.001);

    this.camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.1, 1000.0);
    this.controleur = new ControleurCamera(this.scene, this.camera);
    this.previousNKeyState = this.controleur.nkey;

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

    this.setTrigger(Nimbus, RegionTriggerSphere, { radius: 8 }, [Penguin])
  }

  onTriggerStay(type, actor, coef) {
    //console.log(type, actor, coef)
  }

  update(dt) {
    this.controleur.update(dt);
    this.sim.renderer.render(this.sim.scene, this.camera);
    this.position = this.controleur.position;
    this.object3d.position.setComponent(1, 0)
    this.object3d.lookAt(this.controleur.cible.clone().setComponent(1, 0));
    if (this.controleur.nkey || this.previousNKeyState != this.controleur.nkey) {
      this.displayTrigger(this.controleur.nkey);
      this.previousNKeyState = this.controleur.nkey;
    }
  }

  displayTrigger(value, type = null) {
    this.sim.triggers
      .filter(trig => (type != null) ? trig instanceof type : true)
      .forEach(trig => trig.region.visible = value);
  }
}