import * as THREE from "../lib/three.module.js";

// ======================================================================================================================
// Implémentation de la classe qui permet un contrôle interactif de la caméra virtuelle
// ======================================================================================================================

class ControleurCamera {

	constructor(scene, camera) {
		this.scene = scene;
		this.camera = camera;
		this.position = new THREE.Vector3(1, 1.7, 5);
		this.angle = 0.0;
		this.direction = new THREE.Vector3(1, 0, 0);
		this.cible = new THREE.Vector3(2, 1.7, 5);
		this.vitesse = 2.0;
		this.vitesseAngulaireMax = 0.05;
		this.tauxRotation = 0.0;

		this.plusHaut = false;
		this.plusBas = false;
		this.enAvant = false;
		this.enArriere = false;
		this.aGauche = false;
		this.aDroite = false;

		this.mouse = new THREE.Vector2();
		this.raycaster = new THREE.Raycaster();
		this.mouseClicked = false;
		this.world = null;
		this.origin = new THREE.Vector3();
		this.ext = new THREE.Vector3();
		this.mx = null;
		this.my = null;
		this.mdx = null;
		this.mdy = null;
	}

	update(dt) {
		if (this.plusHaut)
			this.position.y += this.vitesse * dt;

		if (this.plusBas)
			this.position.y -= this.vitesse * dt;

		if (this.aGauche)
			this.angle += 0.05; //this.vitesseAngulaireMax * this.tauxRotation ; 


		if (this.aDroite)
			this.angle -= 0.05; //this.vitesseAngulaireMax * this.tauxRotation ; 

		if (this.enAvant) {
			this.position.x += this.vitesse * dt * Math.cos(this.angle);
			this.position.z += -this.vitesse * dt * Math.sin(this.angle);
		}

		if (this.enArriere) {
			this.position.x -= this.vitesse * dt * Math.cos(this.angle);
			this.position.z -= -this.vitesse * dt * Math.sin(this.angle);
		}

		this.camera.position.copy(this.position);
		this.direction.set(Math.cos(this.angle), 0.0, -Math.sin(this.angle));


		if (this.mouseClicked) {
			this.camera.position.set(this.ext.x, this.ext.y, this.ext.z);
			this.position.set(this.ext.x, this.ext.y, this.ext.z);
			this.cible.set(this.origin.x, this.origin.y, this.origin.z);
			this.direction.set(this.origin.x - this.ext.x, this.origin.y - this.ext.y, this.origin.z - this.ext.z);
			this.angle = -Math.atan2(this.direction.z, this.direction.x);

			this.mouseClicked = false;

		} else {
			this.cible.set(this.position.x + Math.cos(this.angle),
				this.position.y,
				this.position.z - Math.sin(this.angle));

		};

		this.camera.lookAt(this.cible);
	}

	keyUp(event) {
		switch (event.keyCode) {
			case 33: // HAUT
				this.plusHaut = false;
				break;
			case 34: // BAS
				this.plusBas = false;
				break;
			case 37: // GAUCHE
				this.aGauche = false;
				break;
			case 38: // HAUT
				this.enAvant = false;
				break;
			case 39: // DROITE
				this.aDroite = false;
				break;
			case 40: // BAS
				this.enArriere = false;
				break;
		}
	}

	keyDown(event) {
		//this.mouseClicked=false;
		//console.log("KEYDOWN") ; 
		switch (event.keyCode) {
			case 33: // HAUT
				this.plusHaut = true;
				break;
			case 34: // BAS
				this.plusBas = true;
				break;
			case 37: // GAUCHE
				this.aGauche = true;
				break;
			case 38: // HAUT
				this.enAvant = true;
				break;
			case 39: // DROITE
				this.aDroite = true;
				break;
			case 40: // BAS
				this.enArriere = true;
				break;
		}
	}

	mouseMove(event) {
		/*event.preventDefault() ;
		this.mx  = (event.clientX/window.innerWidth)*2-1 ; 
		this.my  = (-event.clientY/window.innerHeight)*2+1 ;
		this.mdx = event.movementX ; 
		this.mdy = event.movementY ;
	
		if(this.mdx >  1 && this.mx > 0) {this.aDroite = true ;  this.aGauche = false} else
		if(this.mdx < -1 && this.mx < 0){this.aDroite = false ; this.aGauche = true} else
		{this.aDroite = false ; this.aGauche = false};
		
		/*if(event.movementX > 5){
			controls.aDroite = true ;
			controls.aGauche = false ;
		} else if(event.movementX < -5){
			controls.aDroite = false ;
			controls.aGauche = true ;
		} */
	}

	mouseDown(event) {
		/*event.preventDefault();
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = (-event.clientY / window.innerHeight) * 2 + 1;
		this.raycaster.setFromCamera(this.mouse, this.camera);
		var intersects = this.raycaster.intersectObjects(this.scene.children, true);
		if (intersects.length > 0) {
			pointeur.position.set(intersects[0].point.x, intersects[0].point.y, +intersects[0].point.z);
			this.mouseClicked = true;
			this.world = intersects[0].object.matrixWorld;
			this.origin = new THREE.Vector3(0, 0, 0);
			this.ext = new THREE.Vector3(0, 0, 2);
			this.origin.applyMatrix4(this.world);
			this.ext.applyMatrix4(this.world);
	
		}*/
	}
}



export default ControleurCamera;
