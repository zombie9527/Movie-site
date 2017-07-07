var mongoose = require('mongoose'),
    cheerio = require("cheerio"),
    models_path = __dirname + 'models',
    Movie = require('./models/movie'),
    http = require('http'),
    https = require('https'),
    movieurl = "http://api.douban.com/v2/movie/subject/",
    downLoadUrl = "http://www.lbldy.com/search/",
    downLoadUrlGet = "http://www.lbldy.com/movie/",
    type = 0,   //1即将上映,2前250
    // url = "http://api.douban.com/v2/movie/top250?start=0&count=40",     //前250
    url = ["http://api.douban.com/v2/movie/top250?start=10&count=1", "http://api.douban.com/v2/movie/coming_soon?start=25&count=10"],                 //即将上映
    fs = require("fs"),
    detailUrl = "https://movie.douban.com/subject/";


mongoose.connect('mongodb://localhost/zombie');