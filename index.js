import Appli from "./code/src/projet.js"

var sim = new Appli();
sim.init({
  surface: { largeur: 100, profondeur: 100 },
  nbPingouin: 2,
  nbHerbe: 200,
  nbRocher: 20
});
sim.actualiser();