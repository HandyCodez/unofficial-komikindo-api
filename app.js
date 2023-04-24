const express = require("express");
const app = express();

app.use(require("./routes/api"));

app.get("/", (req, res) => {
  res.json({
    status: true,
    endpoint: [
      "/api/comic-list/:page",
      "/api/comic-detail/:endpoint",
      "/api/comic-chapter/:endpoint",
    ],
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`SERVER RUNNING AT PORT ${port} WITHOUT YOU`);
});
