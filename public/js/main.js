Vue.config.silent = true   //取消 Vue 所有的日志与警告。
var indexFlag = true;
var ADDMOVIE = true;
var headLand = new Vue({
    el: ".header",
    created: function () {
        let user = localStorage.getItem("USER");
        if (user) {
            user = JSON.parse(user);
            if (new Date().getTime() - user.time > 86400000)
                localStorage.removeItem("USER");
            else
                this.userName = user.name;
        }
    },
    data() {
        var validateName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入账户名'));
            } else {
                if (this.signIn) {
                    this.$http.post('/user/checkName', { name: value })
                        .then(data => {
                            if (data.data.state) callback(new Error('此用户名已被占用'));
                            else callback();
                        })
                }
                else callback();
            }
        },
            validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
        return {
            formTitle: "登录",
            userName: '',
            visible: false,
            signIn: 0,
            ruleForm: {
                name: '',
                ruleForm: '',
                birthday: new Date(),
            },
            rules: {
                name: [
                    { validator: validateName, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ]
            },
            url: [
                "/user/signOn",
                "/user/signIn"
            ]
        }
    },
    methods: {
        quitSign() {
            this.userName = '';
            localStorage.removeItem("USER");
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.ruleForm.password = this.ruleForm.password.MD5();
                    this.$http.post(this.url[this.signIn], {
                        name: this.ruleForm.name,
                        password: this.ruleForm.password,
                        birthday: this.ruleForm.birthday
                    })
                        .then(function (data) {
                            data = data.data;
                            if (data.state) {
                                alert(data.content)
                                return false;
                            }
                            else {
                                this.userName = data.name;
                                let user = {
                                    name: data.name,
                                    age: new Date().getFullYear() - new Date(data.birthday).getFullYear(data.birthday),
                                    time: new Date().getTime(),
                                }
                                localStorage.setItem("USER", JSON.stringify(user));
                                this.visible = false;
                            }
                        })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
});
var showMovies = new Vue({
    el: ".movies",
    data: {
        allmovie: [],
        movieFlag: true,
        endFlag: false,
        ifShow: true,
        start: 0,
        count: 12,
    },
    created: function () {
        let userAge = 0, key = 1
        user = localStorage.getItem("USER");
        if (user) {
            userAge = JSON.parse(user).age;
            if (userAge <= 10)
                key = 1;
            else if (userAge <= 18)
                key = 2;
            else if (userAge <= 35)
                key = 3;
            else if (userAge <= 50)
                key = 4;
            else
                key = 5;
            ADDMOVIE = false;
            this.$http.post('/seachMovie', { index: key }).then(function (data) {
                this.allmovie = data.body;
            })
        }
        else {
            this.$http.post('/getmovies', { start: this.start, count: this.count }).then(function (data) {
                // this.allmovie = JSON.parse(data);
                this.start += this.count;
                // setTimeout(()=> {
                this.allmovie = data.body;
                this.movieFlag = false;
                // }, 3000);
            })
        }
    },
    methods: {
        goDetail(id) {
            showTheDetail(id)
        },
    }
})
var newMovie = new Vue({
    el: "#newMovie",
    data: {
        newmovies: [],
        movieFlag: true,
        ifShow: true,
    },
    created: function () {
        this.$http.post('/getNewMovies').then(function (data) {
            // this.newmovies = JSON.parse(data);
            this.newmovies = data.body;
        })
    },
    methods: {
        goDetail(id) {
            showTheDetail(id)
        },
    }
})
var carousel = new Vue({
    el: "#carousel",
    data: {
        allmovie: [],
        ifShow: true,
    },
    created: function () {
        this.$http.post('/getmovies', { start: 0, count: 6 }).then(function (data) {
            // this.allmovie = JSON.parse(data);
            this.allmovie = data.body;
        })
    },
    methods: {
        goDetail(id) {
            showTheDetail(id)
        },
    }
})
var navbar = new Vue({
    el: "#navbar",
    data: {
        search: '',
        restaurants: [],
        activeIndex: '0',
        ifhave: true,
    },
    created: function () {
        let user = JSON.parse(localStorage.getItem("USER"));
        if (user) {
            let age = user.age;
            // this.activeIndex = ;
            // switch(age){

            // }
        }
    },
    methods: {
        querySearchAsync(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

            this.timeout = setTimeout(() => {
                cb(results.slice(0, 6));
            }, 2000 * Math.random());
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.indexOf(queryString.toLowerCase()) >= 0);
            };
        },
        handleIconClick(item) {
            let user = localStorage.getItem("USER");
            if (!user) {
                headLand.visible = true;
                return;
            }
            this.$http.post('/seachMovie', { title: this.search }).then(function (data) {
                resultMovie.allResult = data.body;
                this.search = "";
                switchControl(2)
            })
        },
        handleSelect(key) {
            console.log(key)
            if (!key) {
                console.log(1)
                return;
            }
            else if (key == 6) {
                this.$http.post('/seachMovie').then(function (data) {
                    resultMovie.allResult = data.body;
                    this.search = "";
                    switchControl(2)
                })
            }
            else if (key > 0 && key < 6) {
                ADDMOVIE = false;
                this.$http.post('/seachMovie', { index: key }).then(function (data) {
                    showMovies.allmovie = data.body;
                    this.search = "";
                    switchControl(3);
                })
            }
        },
    },
    mounted() {
        this.$http.post('/getmoviesname', { start: this.start, count: this.count }).then(function (data) {
            this.restaurants = data.body;
        })
    }
})
var showDetails = new Vue({
    el: ".details",
    data: {
        deFlag: false,
        detail: [],
        textareaComment: '',
    },
    methods: {
        goback() {
            // document.getElementsByClassName('movieBox')[0].style.display = "";
            // showDetails.deFlag = false;
            // carousel.ifShow = true;
            switchControl(0);
        },
        submitComment() {
            if (!this.textareaComment) return;
            let theComment = this.detail.comment || [],
                id = this.detail._id;
            theComment.push({ name: headLand.userName || 'name', content: this.textareaComment });
            console.log(theComment);
            theComment = JSON.stringify(theComment);
            this.$http.post('/movieDetail/addComment', { id, theComment }).then(function (data) {
                if (data) {
                    theComment = '';
                    showTheDetail(this.detail._id);
                }
            })
        }
    }
})
var backTop = new Vue({
    el: ".backTop",
    data: {
        backTopflag: false,
        shouldTop: true,
    },
    methods: {
        flatScrollTo(targetTop = 0, duration, callback) {
            scrollToTop();
            duration = duration || 1000;
            var startPosition = window.pageYOffset;
            var totalOffset = targetTop - startPosition;
            var scrollTimes = duration / 16;
            var currentScrollTimes = 0;
            var animationHandle;
            function easeOut(t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            }
            function scroll() {
                var fff = easeOut(currentScrollTimes, startPosition, totalOffset, scrollTimes);
                window.scrollTo(0, fff);
                currentScrollTimes = currentScrollTimes + 1;
                if (currentScrollTimes >= scrollTimes) {
                    window.cancelAnimationFrame(animationHandle);
                    callback && callback();
                } else {
                    animationHandle = window.requestAnimationFrame(scroll);
                }
            }
            scroll();
        }
    }
})

var resultMovie = new Vue({
    el: ".findResult",
    data: {
        findFlag: false,
        allResult: {},
        newCategory: [],
    },
    created: function () {
        this.$http.get('/api/getCategory').then(function (data) {
            this.newCategory = data.body;
        })
    },
    methods: {
        goDetail(id) {
            showTheDetail(id)
        },
        handleNewClick(key) {
            this.$http.post('/seachMovie', { index: key }).then(function (data) {
                resultMovie.allResult = data.body;
            })
        },
        handleCateClick(e) {
            this.$http.post('/seachMovie', { genres: e.target.innerText }).then(function (data) {
                resultMovie.allResult = data.body;
            })
        },
    }
})

function scrollToTop(scrollHeight = 0) {
    const intervalID = setInterval(() => {
        const scrollTop = document.body.scrollTop;
        if (scrollTop > scrollHeight) {
            window.scrollTo(0, scrollTop - 50);
        } else {
            clearInterval(intervalID);
        }
    }, 10);
}
function showTheDetail(id) {
    // console.log(event.target);
    let user = localStorage.getItem("USER");
    if (!user) {
        headLand.visible = true;
        return;
    }
    callAPI('movieDetail', { id: id }, (err, data) => {
        if (err) return;
        // carousel.ifShow = false;
        // document.getElementsByClassName('movieBox')[0].style.display = "none";
        showDetails.detail = data[0];
        showDetails.detail.casts = JSON.parse(showDetails.detail.casts);
        showDetails.detail.comment = JSON.parse(showDetails.detail.comment);
        showDetails.textareaComment = '';
        switchControl(1);
        scrollToTop();
    })
}

/**
 * 开关控制
 * @param {*} type 
 * 0 首页
 * 1 详情
 * 2 搜索
 * 3 分页
 */
function switchControl(type = 0) {
    carousel.ifShow =
        showMovies.ifShow =
        newMovie.ifShow =
        showDetails.deFlag =
        resultMovie.findFlag = false;
    backTop.shouldTop = true;
    switch (type) {
        case 0: carousel.ifShow = showMovies.ifShow = newMovie.ifShow = true; break;
        case 1: showDetails.deFlag = true; backTop.shouldTop = false; break;
        case 2: resultMovie.findFlag = newMovie.ifShow = true; break;
        case 3: showMovies.ifShow = newMovie.ifShow = true; break;
        default: carousel.ifShow = showMovies.ifShow = newMovie.ifShow = true; break;
    }
}