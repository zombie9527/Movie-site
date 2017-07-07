var mongoose = require('mongoose'),
    Movie = require('../models/movie'),
    Category = require('../models/category'),
    User = require('../models/user.js');

mongoose.connect('mongodb://localhost/zombie');

var Controldb = {
    getMovies( req, res ) {
        var start = req.body.start,
            end = req.body.count + start;
        Movie
            .find({ new: { $not: /true/i } }, { title: 1, poster: 1, _id: 1 })
            .sort({ year: -1 })
            .exec( function ( err, movies ) {
                if ( err ) {
                    console.log( err )
                }
                // console.log( movies );
                var movie = movies || [];
                var results = movie.slice( start, end );
                // var results = movie;

                res.write( JSON.stringify( results ));
                res.end();
            })
    },
    newMovies( req, res ) {
        Movie
            .find({ new: "true" }, { title: 1, poster: 1, _id: 1 })
            .sort({ year: -1 })
            .exec( function ( err, movies ) {
                if ( err ) {
                    console.log( err )
                }
                var movie = movies || [];
                var results = movie.slice( 0, 6 );

                res.write( JSON.stringify( results ));
                res.end();
            })
    },
    findtitle( req, res ) {
        Movie
            .find({ new: { $not: /true/i } }, { title: 1 })
            .exec( function ( err, movies ) {
                if ( err ) {
                    console.log( err )
                }
                var movie = [];
                movies.map( t => movie.push({ value: t.title }));

                res.write( JSON.stringify( movie ));
                res.end();
            })
    },
    getCategoryMovie( req, res ) {
        let cateindex = req.body.index || 0;
        if ( cateindex ) {
            // console.log( cateindex )
            Category
                .find({ index: cateindex }, { _id: 0, include: 1 })
                .exec(( err, category ) => {
                    if ( err ) {
                        console.log( err )
                    }
                    let include = JSON.parse( category[0].include );
                    req.body.genres = "(" + include.join('|') + ")";
                    this.seachMovie( req, res );
                })
        }
        else
            this.seachMovie( req, res );
    },
    seachMovie( req, res ) {
        let sql = {};
        if (!!req.body.title ) sql.title = new RegExp( req.body.title );
        if (!!req.body.genres ) sql.genres = new RegExp( req.body.genres );
        // console.log( sql )
        Movie
            .find( sql )
            .sort({ year: -1 })
            .exec(( err, movies ) => {
                if ( err ) {
                    console.log( err )
                }
                var movie = movies || [];

                res.write( JSON.stringify( movie ));
                res.end();
            })
    },
    findDetail( req, res ) {
        var id = req.body.id;
        Movie
            .find({ _id: id })
            .sort({ year: -1 })
            .exec(( err, movies ) => {
                if ( err ) {
                    console.log( err )
                }
                var movie = movies || [];

                res.write( JSON.stringify( movie ));
                res.end();
            })
    },
    addComment( req, res ) {
        var id = req.body.id,
            comment = req.body.theComment;
        Movie
            .findOneAndUpdate({ _id: id }, { comment: comment })
            .exec(( err, data ) => {
                if ( err ) {
                    console.log( err )
                }
                if ( data )
                    res.write("ok");
                res.end();
            })
    },
    getCategory( req, res ) {
        Category
            .find({}, { _id: 0 })
            .sort({ index: 1 })
            .exec(( err, category ) => {
                if ( err ) {
                    console.log( err )
                }

                res.write( JSON.stringify( category ));
                res.end();
            })
    },
    addCategory( req, res ) {
        Category
            .find({})
            .sort({ index: -1 })
            .exec(( err, categorys ) => {
                if ( err ) {
                    console.log( err )
                }
                let index = categorys.length > 0 ? categorys[0].index + 1 : 1;
                if ( categorys.toString().indexOf( req.body.name ) > -1 ) {
                    res.write(`{ "state": 0, "content": "err" }`);
                    res.end();
                    return;
                }

                let cate = new Category({
                    index: index,
                    name: req.body.name,
                    include: req.body.include,
                })

                cate.save( function ( err ) {
                    if ( err ) {
                        res.write(`{ "state": 0, "content": "err" }`);
                    }
                    else
                        res.write(`{ "state": 1, "content": "success" }`);
                    res.end();
                });
            })
    },
    updataCategory( req, res ) {
        let index = req.body.id,
            name = req.body.name,
            include = req.body.description;
        Category
            .update({ index: index }, { name, include }, err => {
                if ( err )
                    res.end(`{ "state": 0, "content": "err" }`);
                else
                    res.end(`{ "state": 1, "content": "success" }`);
            })
    },
    deleteCategory( req, res ) {
        let index = parseInt( req.body.id );
        Category
            .remove({ index: index }, err => {
                if ( err )
                    res.end(`{ "state": 0, "content": "err" }`);
                else
                    res.end(`{ "state": 1, "content": "success" }`);
            });
    },
    checkName( req, res ) {
        let name = req.body.name;
        User.findOne({ name: name }).exec(( err, data ) => {
            // console.log( data )
            if (!data )
                res.write(`{ "state": 0, "content": "err" }`);
            else
                res.write(`{ "state": 1, "content": "success" }`);
            res.end();
        })
    },
    signOn( req, res ) {
        let name = req.body.name,
            password = req.body.password;
        User.findOne({ name: name }).exec(( err, user ) => {
            if (!user )
                res.end(`{ "state": 1, "content": "该用户不存在" }`);
            else {
                user.comparePassword( password, function ( err, isMatch ) {
                    if ( err ) {
                        console.log( err );
                        return;
                    }
                    if ( isMatch ) {
                        // 更新用户的登录次数
                        User.update({ _id: user._id }, { $set: { lastLogin: new Date() } }, function ( err ) {
                            if ( err ) {
                                console.log( err );
                                return;
                            }
                        });
                        res.write( JSON.stringify( user ));
                        res.end();
                    } else {
                        res.end(`{ "state": 1, "content": "密码错误" }`);
                    }
                });
            }
        })
    },
    signIn( req, res ) {
        let name = req.body.name;
        User.findOne({ name: name }).exec(( err, data ) => {
            if ( data )
                res.end(`{ "state": 1, "content": "用户名已存在" }`);
            else {
                let user = new User({
                    name: req.body.name,
                    password: req.body.password,
                    birthday: req.body.birthday
                })

                user.save( function ( err ) {
                    if ( err ) {
                        res.write(`{ "state": 1, "content": "err" }`);
                        res.end();
                    }
                    else {
                        res.write( JSON.stringify( user ));
                        res.end();
                    }
                });
            }
        })
    },
    getAllUser( req, res ) {
        let name = req.body.name;
        User.find({}).exec(( err, data ) => {
            // console.log( data )
            if (!data )
                res.write(`{ "state": 0, "content": "err" }`);
            else
                res.write( JSON.stringify( data ));
            res.end();
        })
    },

}
module.exports = Controldb;