import App from "./src/App.js"

const app = new App()
app.init({
  ground: { width: 100, depth: 100 },
  penguinCount: 10,
  penguinReynoldsCount: 10,
  grassCount: 200,
  rockCount: 80
});
app.update();