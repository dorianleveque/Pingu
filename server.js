const express = require('express');

const host = "localhost";
const port = 3000;

const app = express();

// dossier à servir 
app.use(express.static('./MASTER/code/'));

app.listen(port, host, () => {
  console.log(`Server listen on ${host}:${port}`);
})