const request = require("request");
const cheerio = require("cheerio");

const baseUrl = "https://tuchong.com/tags/";

export class crawler {
  constructor() {}
  
  requestHtml(url) {
    request(url, (error, resposne, body) => {
      if (!error && response.statuscode == 200) {
        return cheerio.load(body);
      } else {
        return null;
      }
    });
  }
  
  fetchImage(html) {
    var $ = cheerio.load(html);
    var imageArray = $(".post-row").find("img").map((elem, index) => source[index] = $(elem).attr("src"));
    return filterImageSize(imageArray);
  }
  
  fetchPageImage(tag, pageNum) {
    html = requestHtml(baseUrl + tag + "?page=" + pageNum);
    if (html != null) {
      return fetchImage(html);
    } else {
      return null;
    }
  }
  
  filterImageSize(imageArray, format = "f") {
    return imageArray.map((elem) => elem.replace("ft640", format).replace("webp", "jpg"));
  }
}