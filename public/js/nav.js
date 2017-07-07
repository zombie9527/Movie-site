(function (window, document) {
    var h = 71, n = 520;//h:导航栏高度。n:热门电影位置
    const takeNum = 9;  //加载数
    var preStart = 0;

    /**
    * 函数节流方法
    * @param Function fn 延时调用函数
    * @param Number delay 延迟多长时间
    * @return Function 延迟执行的方法
    */
    var throttle = function (fn, delay = 100) {
        var timer = null;

        return function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn();
            }, delay);
        }
    };
    window.addEventListener('scroll', throttle(judgePos));
    function judgePos() {
        var num = document.documentElement.scrollTop || document.body.scrollTop;
        var webHeight = document.body.scrollHeight;
        if (num > h) {
            document.getElementById('navbar').style.position = 'fixed';
        } else {
            document.getElementById('navbar').style.position = 'static';
        };
        if (num > n) {
            document.getElementById('newMovie').style.position = 'fixed';
            backTop.backTopflag = true;
        } else {
            document.getElementById('newMovie').style.position = 'static';
            backTop.backTopflag = false;
        };
        if (num > (webHeight * 0.6) && ADDMOVIE) {
            if (showMovies.endFlag) return;
            showMovies.movieFlag = true;
            callAPI('/getmovies', { start: showMovies.start, count: takeNum }, (err, data) => {
                if (err || preStart == showMovies.start) return;
                preStart = showMovies.start;
                setTimeout(function () {
                    if (data.length) {
                        data.forEach((item, index) => { showMovies.allmovie.push(item) })
                        showMovies.start += takeNum;
                    }
                    else
                        showMovies.endFlag = true;
                    showMovies.movieFlag = false;
                }, 2000);
            });
        }
    }


})(window, document);