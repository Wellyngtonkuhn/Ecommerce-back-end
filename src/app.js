const express = require("express");
const routes = require("./routes/route");
const app = express();

const port = 3004 || "";

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(routes);

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
