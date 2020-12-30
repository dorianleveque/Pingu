import * as THREE from "../../lib/three.module.js";
import Component from "./Component.js"
import Rock from "../Rock.js"

export default class ObstacleAvoidance extends Component {

  constructor(actor, options = []) {
    super(actor);
    this.typeClass = options;
    this.coef = 0.5;
  }

  update(dt) {
    /* Test palpeur
    const ProchainePosition = this.actor.position.clone();
    ProchainePosition.addScaledVector(this.actor.velocity, dt);
    
    const P_ = ProchainePosition.divideScalar(ProchainePosition.length()).multiplyScalar(0.5)
    
    this.actor.sim.actors.filter(actor => actor.constructor.name == "Rock").forEach(actor => {
      const CP_ = actor.position.clone().sub(P_);
      if (CP_.length() < 5) {
        //console.log(CP_.length())
        const P__ = CP_.clone().divideScalar(CP_.length()).sub(actor.position)
        //this.actor.applyForce(P__)
      }
    });*/

    const raycaster = new THREE.Raycaster(this.actor.position, this.actor.velocity.clone().normalize(), 0.1, this.actor.velocity);
    raycaster.intersectObjects(this.actor.sim.actors.filter(actor => actor.constructor.name === "Rock").map(actor => actor.object3d)).forEach(element => {
      const { distance, object } = element;
      if (distance < 15) {
        //console.log(element)
        // On prend P le point du pingouin, P' sa prochaine position et C le centre de l'obstacle
        const PP_ = this.actor.position.clone().addScaledVector(this.actor.velocity, dt);
        const PC = new THREE.Vector3();
        PC.subVectors(object.position, this.actor.position); // (x1; y1) // => Connu
        
        // Calcul du vecteur orthogonal
        const orthoPC = object.position.clone().reflect(PC).divideScalar(PC.length())
  
        const projection = PC.dot(PP_);
        //Vecteur orthogonal à PC = (1; -x1 / y1)
        // Rendre ce vecteur unitaire
        //Vecteur orthogonal unitaire = Vecteur orthogonal à PC / norme(Vecteur orthogonal à PC)
        // On va pouvoir projeter PP' dessus => Produit scalaire 
        //Projection = PC produit scalaire PP'
        
        // La projection peut être positive ou négative donc c'est parfait.
        // On peut utiliser ça pour faire changer le sens de l'évitement
        // Vecteur force à appliquer = (Coef / Projection) * Vecteur orthogonal unitaire
        const Fo = orthoPC.multiplyScalar(object.geometry.boundingSphere.radius * 5 / projection);
        this.actor.applyForce(Fo);
        // Le coef va réguler la force à appliquer. Plus il est grand plus le pingouin va dégager. J'ai pas vraiment trouvé de formule adéquate donc il faut y aller à tatillons. Coef > 0 par contre.
      }

    });;



  }
}

    //const Vd = PositionCible.clone().divideScalar(PositionCible.length()).multiplyScalar(actor.velocityMax)


    /*const box = new THREE.Box3().setFromObject(this.actor.object3d);
    const x = box.min.x;
    const y = box.min.y;
    const z = box.min.z;
    const width = box.max.x - x;
    const height = box.max.y - y;
    const depth = box.max.z - z;
    //console.log(x, z, width, height);

    const detectArea = new THREE.Box3(new THREE.Vector3(width, y, z), new THREE.Vector3(width + 5, height, depth))

    /*this.actor.sim.actors.filter(actor => actor instanceof Rock).forEach(actor => {
      console.log(detectArea.containsPoint(actor.position))

      /*box.geometry.computeBoundingBox(); // This is only necessary if not allready computed
      box.updateMatrixWorld(true); // This might be necessary if box is moved

      var boxMatrixInverse = new THREE.Matrix4().getInverse(box.matrixWorld);

      var inverseBox = box.clone();
      var inversePoint = point.clone();

      inverseBox.applyMatrix(boxMatrixInverse);
      inversePoint.applyMatrix4(boxMatrixInverse);

      var bb = new THREE.Box3().setFromObject(inverseBox);

      var isInside = bb.containsPoint(inversePoint);
      
      actor.position
    })*/