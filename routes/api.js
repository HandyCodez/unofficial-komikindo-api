const express = require("express");
const router = express.Router();

const {
  comicList,
  comicdetail,
  comicchapter,
  search,
  comicPop,
  genreList,
  genreDetail,
} = require("../controllers/apiController");
router.get("/api/comic-list/:page", comicList);
router.get("/api/comic-detail/:endpoint", comicdetail);
router.get("/api/comic-chapter/:endpoint", comicchapter);
router.get("/api/comic-search/:query", search);
router.get("/api/comic-pop", comicPop);
router.get("/api/genre-list", genreList);
router.get("/api/genre-detail/:endpoint/:page", genreDetail);

module.exports = router;
