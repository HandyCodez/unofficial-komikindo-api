const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(require("./routes/api"));

app.get("/", (req, res) => {
  res.json({
    status: true,
    endpoint: [
      "/api/comic-list/:page",
      "/api/comic-detail/:endpoint",
      "/api/comic-chapter/:endpoint",
      "/api/comic-search/:query",
      "/api/comic-pop",
      "/api/genre-list",
      "/api/genre-detail/:endpoint/:page",
    ],
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`SERVER RUNNING AT PORT ${port} WITHOUT YOU`);
});
