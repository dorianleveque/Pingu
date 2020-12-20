import * as THREE from "../../lib/three.module.js";
import Component from "./Component.js"

const Fs = function(actor) {
  const PositionCible = new THREE.Vector3();
  PositionCible.subVectors(actor.target, actor.position);

  const Vd = PositionCible.clone().divideScalar(PositionCible.length()).multiplyScalar(actor.velocityMax)
  
  const VdSubVc = new THREE.Vector3()
  VdSubVc.subVectors(Vd, actor.velocity)
  
  const Fs = VdSubVc.clone()
  if (VdSubVc.length() > 0) Fs.divideScalar(VdSubVc.length())
  Fs.multiplyScalar(Math.min(actor.forceMax, VdSubVc.length()))
  return Fs
}


export class Seek extends Component {

  constructor(actor, options = []) {
    super(actor)
  }

  update(dt) {
    this.actor.applyForce(Fs(this.actor))
  }
}

export class Flee extends Component {

  constructor(actor, options = []) {
    super(actor)
  }

  update(dt) {
    this.actor.applyForce(-Fs(this.actor))
  }
}