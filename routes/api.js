const express = require("express");
const router = express.Router();

const {
  comicList,
  comicdetail,
  comicchapter,
  search,
} = require("../controllers/apiController");
router.get("/api/comic-list/:page", comicList);
router.get("/api/comic-detail/:endpoint", comicdetail);
router.get("/api/comic-chapter/:endpoint", comicchapter);
router.get("/api/comic-search/:query", search);

module.exports = router;
