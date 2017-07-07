(function (window, document) {
    const config = {
        test: "127.0.0.1"
    }
    function createAjax() {
        let xmlhttp = {};
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        }
        return xmlhttp;
    }
    const CallAPI = function (path, reqData, callback) {
        const xhr = createAjax();
        xhr.open('POST', path, true);
        try {
            xhr.setRequestHeader('Content-Type', 'application/json');
            // xhr.setRequestHeader('X-auth-token', Storage.getItem(UserStorage.token));
            xhr.send(JSON.stringify(reqData));
        } catch (e) {
            console.log('发送数据－网络错误，请稍后重试');
        }
        xhr.onload = () => {
            // const globalTips = Storage.getItem('globalTips');
            let json;
            let err;
            try { json = JSON.parse(xhr.responseText); } catch (e) { err = e; }
            switch (xhr.status) {
                case 200: callback(err, json); break;
                case 401: {
                    callback(err, json);
                    // if (!globalTips) { console.log('401'); }
                } break;
                // default: if (!globalTips) { console.log(`${xhr.status}-网络错误，请稍后重试`); } break;
            }
        };
        xhr.onerror = () => {
            // const globalTips = Storage.getItem('globalTips');
            // if (!globalTips) {
                if (xhr.readyState === 4) {
                    console.log('服务器错误，请反馈给我们');
                } else {
                    console.log('网络错误，请检查你的网络链接，刷新重试');
                }
            // }
        };
    }

    window.callAPI = CallAPI;
})(window, document);