const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config");

const app = express();
const port = config.port || 3000;

app.use(bodyParser.json({ limit: "1mb" }));
app.use(require("./routes"));
app.use((req, res) => res.status(404).send({ error: "Page not found" }));

app.listen(port, () => {
  console.log(`Backup Server listening on port ${port}`);
});
