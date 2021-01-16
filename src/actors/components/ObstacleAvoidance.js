import * as THREE from "../../../lib/three.module.js";
import Component from "./Component.js"
import Rock from "../Rock.js"

export default class ObstacleAvoidance extends Component {

  constructor(actor, options = []) {
    super(actor);
    const [obstacles, coef] = options;
    this.obstacles = obstacles;
    this.coef = coef || 10;
  }

  update(dt) {

    let mind = 0;
    this.obstacles.filter(e => e instanceof Rock).sort((a, b) => this.actor.position.distanceTo(a.position) - this.actor.position.distanceTo(b.position)).forEach((obstacle, index) => {
      if (index == 0) {
        mind = this.actor.position.distanceTo(obstacle.position);
      }

      const P_ = this.actor.position.clone();
      P_.add(this.actor.velocity);
  
      const PP_ = new THREE.Vector3();
      PP_.subVectors(P_, this.actor.position);
      PP_.divideScalar(PP_.length())
      PP_.multiplyScalar(this.coef);
      const CP_ = P_.clone().sub(obstacle.position)
      const r = obstacle.object3d.geometry.boundingSphere.radius;
      if (CP_.length() < r+1.2) {
        const PP__ = CP_.clone().divideScalar(CP_.length()).multiplyScalar((r + 1.2) * this.actor.velocity.length() * this.coef * mind / this.actor.position.distanceTo(obstacle.position))//.sub(obstacle.position);
        this.actor.applyForce(PP__)
      }
    })
  }
}