import Appli from "./src/projet.js"

var sim = new Appli();
sim.init({
  ground: { width: 100, depth: 100 },
  penguinCount: 10,
  grassCount: 200,
  rockCount: 80
});
sim.update();