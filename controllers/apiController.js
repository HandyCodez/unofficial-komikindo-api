const baseUrl = require("../constant/url");
const axios = require("axios");
const cheerio = require("cheerio");

const comicList = async (req, res) => {
  const page = req.params.page;
  const url = page < 2 ? "/daftar-manga" : `/daftar-manga/page/${page}`;

  try {
    axios({
      url: `${baseUrl}${url}`,
      headers: {
        "User-Agent": "Chrome",
      },
      method: "get",
    })
      .then((result) => {
        const $ = cheerio.load(result.data);

        let data = [];
        let thumb,
          title,
          score,
          warna,
          endpoint,
          type,
          pagination = [];

        $(".animepost").each((index, el) => {
          thumb = $(el).find("img").attr("src");
          title = $(el).find(".tt").text().trim();
          score = $(el).find(".rating > i").text();
          warna =
            $(el).find(".warnalabel").text().trim() === "Warna" ? true : false;
          type = $(el)
            .find(".limit > span")
            .attr("class")
            .replace("typeflag ", "");
          endpoint = $(el)
            .find("a")
            .attr("href")
            .replace(`${baseUrl}/komik/`, "")
            .replace("/", "");
          data.push({
            title,
            thumb,
            score,
            warna,
            type,
            endpoint,
          });
        });

        $(".pagination a").each((index, el) => {
          pagination.push($(el).text());
        });

        res.json({
          status: true,
          data: data,
          pagination: pagination,
        });
      })
      .catch((error) => {
        res.json({
          status: false,
          message: error,
        });
      });
  } catch (error) {
    return res.json({
      status: false,
      message: error,
    });
  }
};

const comicdetail = async (req, res) => {
  const endpoint = req.params.endpoint;
  const url = `/komik/${endpoint}`;

  try {
    axios({
      url: `${baseUrl}${url}`,
      headers: {
        "User-Agent": "Chrome",
      },
      method: "get",
    })
      .then((result) => {
        const $ = cheerio.load(result.data);

        let title,
          relative = [],
          title_ref,
          link_ref,
          thumb,
          score,
          scoredBy,
          rawInfo = [],
          genre = [],
          genre_title,
          genre_ref,
          sinopsis,
          teaser = [],
          teaser_image,
          similar = [],
          similar_image,
          similar_title,
          similar_endpoint,
          similar_desc,
          chapter_list = [],
          chapter_title,
          chapter_date,
          chapter_endpoint;
        title = $(".entry-title").text().replace("Komik\n", "");
        thumb = $(".thumb").find("img").attr("src");
        score = $(".ratingmanga").find("i").text().replace("\n", "");
        scoredBy = $(".ratingmanga")
          .find(".votescount")
          .text()
          .replace("\n", "")
          .replace("\n", "");

        // relativ
        $(".epsbaru > div").each((index, el) => {
          title_ref = $(el).find(".barunew").text();
          link_ref = $(el)
            .find("a")
            .attr("href")
            .replace(`${baseUrl}/`, "")
            .replace("/", "");

          relative.push({
            title_ref,
            link_ref,
          });
        });

        // INFO
        $(".spe span").each((i, el) => {
          const p = $(el).text().trim();
          rawInfo.push(p);
        });
        const info = rawInfo.reduce((acc, item) => {
          const [name, value] = item.split(":");
          acc.push({ [name]: value.replace("\n", "").replace("\n", "") });
          return acc;
        }, []);

        // GENRE
        $(".genre-info > a").each((i, el) => {
          genre_title = $(el).text();
          genre_ref = $(el).attr("href").replace("/genres/", "");

          genre.push({
            genre_title,
            genre_ref,
          });
        });

        // TEASER
        $(".spoiler > div").each((i, el) => {
          teaser_image = $(el).find("img").attr("src");

          teaser.push({
            teaser_image,
          });
        });

        // SIMILIAR
        $(".serieslist > ul > li").each((i, el) => {
          similar_image = $(el).find("img").attr("src");
          similar_title = $(el).find(".leftseries > h4").text();
          similar_endpoint = $(el)
            .find(".leftseries > h4 > a")
            .attr("href")
            .replace(`${baseUrl}/komik/`, "")
            .replace("/", "");
          similar_desc = $(el).find(".excerptmirip").text().replace("\n", "");

          similar.push({
            similar_image,
            similar_title,
            similar_endpoint,
            similar_desc,
          });
        });

        // CHAPTER LIST
        $("#chapter_list")
          .find("li")
          .each((i, el) => {
            chapter_title = $(el).find(".lchx").find("chapter").text();
            chapter_date = $(el).find(".dt").text();
            chapter_endpoint = $(el)
              .find("a")
              .attr("href")
              .replace(`${baseUrl}/`, "")
              .replace("/", "");

            chapter_list.push({
              chapter_title,
              chapter_date,
              chapter_endpoint,
            });
          });

        sinopsis = $(".desc").find("p").text().replace("\n", "");

        const details = {
          title,
          endpoint,
          thumb,
          score,
          scoredBy,
          relative,
          info,
          genre,
          teaser,
          similar,
          chapter_list,
          sinopsis,
        };

        res.json({
          status: true,
          data: details,
        });
      })
      .catch((error) => {
        res.json({
          status: false,
          message: error,
        });
      });
  } catch (error) {
    res.json({
      status: false,
      message: error,
    });
  }
};

const comicchapter = async (req, res) => {
  const endpoint = req.params.endpoint;

  try {
    axios({
      url: `${baseUrl}/${endpoint}`,
      headers: {
        "User-Agent": "Chrome",
      },
      method: "get",
    })
      .then((result) => {
        const $ = cheerio.load(result.data);
        let title,
          images = [],
          image_link,
          image_alt,
          relativeRaw = [],
          relative_title,
          relative_endpoint,
          chapters = [];

        title = $(".entry-title").text();

        // image
        $("#chimg-auh > img").each((i, el) => {
          image_link = $(el).attr("src");
          image_alt = $(el).attr("alt");

          images.push({
            image_link,
            image_alt,
          });
        });

        // relative
        $(".nextprev")
          .first()
          .find("a")
          .each((i, el) => {
            relative_title = $(el).text().trim();
            relative_endpoint = $(el)
              .attr("href")
              .replace(`${baseUrl}/`, "")
              .replace("komik/", "")
              .replace("/", "");

            relativeRaw.push({
              relative_title,
              relative_endpoint,
            });
          });

        let relative = relativeRaw.filter((val, index) => {
          return val.relative_title !== "Download Chapter";
        });

        chapters.push({
          title,
          relative,
          images,
        });

        res.json({
          status: true,
          data: chapters,
        });
      })
      .catch((error) => {
        res.json({
          status: false,
          message: error,
        });
      });
  } catch (error) {
    res.json({
      status: false,
      message: error,
    });
  }
};

const search = async (req, res) => {
  const query = req.params.query;

  try {
    axios({
      url: `${baseUrl}?s=${query}`,
      headers: {
        "User-Agent": "Chrome",
      },
      method: "get",
    })
      .then((result) => {
        const $ = cheerio.load(result.data);
        let data = [],
          page_title,
          thumb,
          title,
          score,
          warna,
          endpoint,
          type;
        // pagination = [];

        page_title = $(".page-title").text();

        // ANIME LIST
        $(".animepost").each((index, el) => {
          thumb = $(el).find("img").attr("src");
          title = $(el).find(".tt").text().trim();
          score = $(el).find(".rating > i").text();
          warna =
            $(el).find(".warnalabel").text().trim() === "Warna" ? true : false;
          type = $(el)
            .find(".limit > span")
            .attr("class")
            .replace("typeflag ", "");
          endpoint = $(el)
            .find("a")
            .attr("href")
            .replace(`${baseUrl}/komik/`, "")
            .replace("/", "");
          data.push({
            title,
            thumb,
            score,
            warna,
            type,
            endpoint,
          });
        });

        // pagination
        // $(".pagination a").each((index, el) => {
        //   pagination.push($(el).text());
        // });

        res.json({
          status: true,
          data: data,
        });
      })
      .catch((error) => {
        res.send({
          status: false,
          message: error,
        });
      });
  } catch (error) {
    res.json({
      status: false,
      message: error,
    });
  }
};

module.exports = { comicList, comicdetail, comicchapter, search };
