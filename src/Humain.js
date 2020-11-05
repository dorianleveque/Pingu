import * as THREE from "../lib/three.module.js";
import Acteur from "./Acteur.js"
import ControleurCamera from "./ControleurCamera.js"
import { chargerObj } from "./prims.js"

export default class Humain extends Acteur {

  constructor(sim, options = {}) {
    super(sim);
    this.setObjet3d(chargerObj("humain", "assets/obj/humain/humain.obj", "assets/obj/humain/humain.mtl"))
    this.objet3d.scale.set(0.02, 0.02, 0.02);

    this.camera = new THREE.PerspectiveCamera(45.0, window.innerWidth / window.innerHeight, 0.1, 1000.0);
		this.camera.position.set(5.0, 1.7, 5.0);
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
  }

  actualiser(dt) {
    this.controleur.update(dt);
    this.sim.renderer.render(this.sim.scene, this.camera);
  }
}