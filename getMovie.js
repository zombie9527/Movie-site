var mongoose = require('mongoose'),
    cheerio = require("cheerio"),
    models_path = __dirname + 'models',
    Movie = require('./models/movie'),
    http = require('http'),
    https = require('https'),
    movieurl = "http://api.douban.com/v2/movie/subject/",
    downLoadUrl = "http://www.lbldy.com/search/",
    downLoadUrlGet = "http://www.lbldy.com/movie/",
    type = 0,   //0即将上映,1前250
    // url = "http://api.douban.com/v2/movie/top250?start=0&count=40",     //前250
    urls = ["http://api.douban.com/v2/movie/in_theaters", "http://api.douban.com/v2/movie/top250", "http://api.douban.com/v2/movie/coming_soon",
    ],                 //即将上映
    url = '',
    fs = require("fs"),
    detailUrl = "https://movie.douban.com/subject/",
    successNum = errNum = 0;


// mongoose.connect('mongodb://localhost/zombie');

var GetMovie = {};
GetMovie.init = function ({ thetype = 0, thestart = 0, thecount = 10, theurl = "" }, res) {
    if (!theurl) {
        url = `${urls[thetype]}${(thestart || thecount) ? '?' : ''}${thestart ? 'start=' + thestart + '&' : ''}${thecount ? 'count=' + thecount : ''}`;
    } else
        url = theurl;
    type = thetype;
    console.log(url)
    //     console.log(`${urls[thetype]}${(thestart || thecount) ? '?' : ''}${thestart ? 'start='+ thestart+'&':''}${thecount?'count='+thecount:''}`)
    // res.write(JSON.stringify({thetype,thestart,thecount,theurl}));
    this.saveMovie(res);
}

GetMovie.saveMovie = function (resultres) {
    // console.log(0)
    http.get(url, function (res) {
        var json = '';

        res.on('data', function (data) {
            json += data;
        });

        res.on('end', function () {
            // console.log(2)
            // console.log(json)

            json = JSON.parse(json);

            movies = json.subjects;

            // console.log(333);
            var comment = [{
                "name": "富态的浣熊",
                "content": " 就是喜欢猩猩，不能看猩猩受苦！只要猩猩赢了别的都不在乎！\n        "
            },
            {
                "name": "影志",
                "content": " 给IMAX特制版片头一万个赞！要知道每次看IMAX最爱看的就是那个“屏息以待”倒计时片头，今天还是头一回看到制作成符合剧情的设计…没有“美女与野兽”式剧情，没有帝国大厦顶峰对决，依然被金刚的“大”震的合不拢嘴…最爱他孤独的背影，越大越孤独。\n        "
            },
            {
                "name": "弗朗索瓦张。",
                "content": " 《景甜宇宙之神奇动物在哪里》。毫无意义的原始人部落，毫无意义的金刚救美，毫无意义的甜甜。(PS楼上说视效大片不需要剧情的那位你到底看没看过电影？)\n        "
            },
            { "name": "Ron Chan", "content": " 话多的不是死就是拼了命的打怪，想要活得不累就学学人家大甜甜，说了9句话，轻轻松松的活到了最后，估摸那两腿蜥蜴都不知道她的存在！\n        " }];
            comment = JSON.stringify(comment);
            // let allmovies = [];
            // if (!movies.length)
            //     allmovies.push(movies);
            // else
            //     allmovies = movies
            for (var movie in movies) {

                /* 评论获取
                下载地址*/
                function saveone(movie) {
                    let title = encodeURI(movies[movie].title);
                    http.get(downLoadUrl + title, function (res) {

                        // console.log(555);
                        var html = '';

                        res.on('data', function (data) {
                            html += data;
                        });

                        res.on('end', function () {
                            let $ = cheerio.load(html);
                            /*
                            console.log($("#hot-comments").text());
                            $("#hot-comments .comment").each((i, e) => {
                                let tiname = $(e).find(".comment-info a:first").text();
                                let conname = $(e).find(" p:first").text();
                                comment.push({ name: tiname, content: conname });
                                console.log(2);
                                console.log(tiname);
                            })
                            */

                            // console.log($(".postlist").find("h4>a").attr("href"));
                            // $(".postlist:eq(0)>h4>a").attr("href");
                            http.get($(".postlist").find("h4>a").attr("href") || "http://www.lbldy.com/essays/5.html", function (res) {
                                // console.log(2)
                                var html = '';

                                res.on('data', function (data) {
                                    html += data;
                                });

                                res.on('end', function () {
                                    let $ = cheerio.load(html);
                                    // console.log($("a[href^='ed2k://']").attr('href'))
                                    var download = $("a[href^='ed2k://']").attr('href') || "";

                                    http.get(movieurl + movies[movie].id, function (res) {
                                        var result = '';

                                        res.on('data', function (data) {
                                            result += data;
                                        });

                                        res.on('end', function () {
                                            // console.log(4)
                                            // console.log(movieurl + movies[movie].id)
                                            result = JSON.parse(result);
                                            // console.log(result)
                                            if (result.code == 5000) return
                                            if (!type)
                                                var img = "images/spst" + result.images.large.slice(result.images.medium.lastIndexOf('/'));    //中图
                                            else
                                                var img = "images/lgst" + result.images.large.slice(result.images.large.lastIndexOf('/')); //大图
                                            var amovie = new Movie({
                                                rating: result.rating.average / 2,
                                                directors: result.directors[0].name,
                                                title: result.title,
                                                country: result.countries,
                                                summary: result.summary,
                                                genres: result.genres.toString(),
                                                poster: img,
                                                year: result.year,
                                                comment: comment,
                                                casts: JSON.stringify(result.casts),
                                                aka: JSON.stringify(result.aka),
                                                new: !type ? true : false,
                                                download_url: download,
                                            })
                                            // console.log(amovie)
                                            amovie.save(function (err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                                else
                                                    console.log('ok'+successNum);

                                            });
                                            http.get(result.images.large, function (res) {
                                                var imgData = "";

                                                res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开


                                                res.on("data", function (chunk) {
                                                    imgData += chunk;
                                                });

                                                res.on("end", function () {
                                                    fs.writeFile("./public/" + img, imgData, "binary", function (err) {
                                                        if (err) {
                                                            // console.log("down fail");
                                                            errNum++;
                                                        }
                                                        // console.log("down success");
                                                        else
                                                            successNum++;
                                                        if (movies.length == successNum + errNum) {
                                                            resultres.write(`成功保存${successNum}个电影,失败${errNum}个`);
                                                            resultres.end();
                                                        }

                                                    });
                                                });
                                            });
                                        });
                                    });/*评论*/
                                });
                            });
                        });
                    });
                };
                saveone( movie);
            }
        });
    });

}

module.exports = GetMovie;
// var comment = [];
// $("#hot-comments .comment").each((i, e) => {
//     let tiname = $(e).find(".comment-info a:first").text();
//     let conname = $(e).find(" p:first").text();
//     comment.push({ name: tiname, content: conname });
// })
//     console.log(JSON.stringify(comment));