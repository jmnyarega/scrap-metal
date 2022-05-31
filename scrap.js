const puppeteer = require("puppeteer");
const fs = require("fs");

const y_url = "https://www.youtube.com/results?search_query=pop";

const urls = "a.ytd-video-renderer";
const views = "span.ytd-video-meta-block:first-child";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(y_url);

  const links = await page.evaluate(
    (resultsSelector, views) => {
      const anchors = Array.from(document.querySelectorAll(resultsSelector));
      const views_count = Array.from(document.querySelectorAll(views));

      return anchors.map(
        (anchor, i) =>
          anchor.href &&
          anchor.title &&
          `"${anchor.title}", ${anchor.href}, "${
            views_count[i]?.textContent || ""
          }"`
      );
    },
    urls,
    views
  );

  fs.writeFile("playlist_files.csv", links.join("\n"), (_err, data) => {
    if (data) {
      console.log("DONE!!!");
    }
  });

  await browser.close();
})();
