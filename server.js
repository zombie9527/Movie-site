var express = require('express'),
    path = require('path'),
    port = process.env.PORT || 3000,
    app = express(),
    fs = require('fs'),
    dbcontrol = require('./controls/index.js'),
    bodyParser=require('body-parser'),
    getMovieControl = require('./getMovie.js');

var models_path = __dirname + 'models';

app.listen(port);

app.set('views','./views/pages');
app.set('view engine',"jade");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});
app.post('/getmovies', function(req, res) {
	dbcontrol.getMovies(req, res);
});
app.post('/getNewMovies', function(req, res) {
	dbcontrol.newMovies(req, res);
});
app.post('/movieDetail',(req,res)=>{dbcontrol.findDetail(req,res)});
app.post('/movieDetail/addComment',(req,res)=>{dbcontrol.addComment(req,res)});
app.post('/getmoviesname',(req,res)=>{dbcontrol.findtitle(req,res)});
app.post('/seachMovie',(req,res)=>{dbcontrol.getCategoryMovie(req,res)});
app.post('/user/checkName',(req,res)=>{dbcontrol.checkName(req,res)});
app.post('/user/signOn',(req,res)=>{dbcontrol.signOn(req,res)});
app.post('/user/signIn',(req,res)=>{dbcontrol.signIn(req,res)});

/**
 * 后台处理
 */
/**
 * 页面路由
 */
app.get('/admin/',function(req,res){
    res.render('login');
    res.end();
})
app.post('/admin/login',function(req,res){
    if(req.body.name =="admin"){
        if(req.body.password == "111111"){
            res.end('{"state":0,"content":"index"}');
        }
        else{
             res.end('{"state":1,"content":"密码错误"}');
        }
    }
    else{
         res.end('{"state":1,"content":"用户名不存在"}');
    }
})
app.get('/admin/index',function(req,res){
    res.render('index',{name:"admin",focus:"index"})
})
app.get('/admin/category',function(req,res){
    res.render('category',{name:"admin",focus:"category"})
})
app.get('/admin/movie',function(req,res){
    res.render('getmovie',{name:"admin",focus:"movie"})
})
app.get('/admin/users',function(req,res){
    res.render('users',{name:"admin",focus:"users"})
})
/**
 * 数据处理
 */
/**
 * 分类
 */
app.get('/api/getCategory',function(req,res){
    dbcontrol.getCategory(req, res);
})
app.post('/api/addCategory',function(req,res){
    dbcontrol.addCategory(req, res);
})
app.post('/api/category/updataCategory',function(req,res){
    dbcontrol.updataCategory(req, res);
})
app.post('/api/category/deletebooks',function(req,res){
    dbcontrol.deleteCategory(req, res);
})
app.post('/api/user/getAll',function(req,res){
    dbcontrol.getAllUser(req, res);
})
app.post('/api/movie/add',function(req,res){
    let body = req.body;
    getMovieControl.init(body, res);
})