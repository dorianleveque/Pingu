import App from "./src/App.js"

const app = new App()
app.init({
  ground: { width: 100, depth: 100 },
  penguinCount: 10,
  babyPenguinCount: 10,
  grassCount: 200,
  rockCount: 200
});
app.update();