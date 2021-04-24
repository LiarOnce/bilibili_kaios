const build = '5442100';
const android = {
    key: '1d8b6e7d45233436',
    secret: '560c52ccd288fed045859ed18bffd973'
};
const tv = {
    key: '4409e2ce8ffd12b8',
    secret: '59b43e04ad6965f34319062b478f83dd'
};

$.extend({
    initApi: function () {
        $.ajaxSettings.xhr = function () {
            try {
                return new XMLHttpRequest({ mozSystem: true });
            } catch (e) { }
        };
    },
    postApi: function (url, content, keyValue) {
        var json = null;
        if (keyValue == undefined || keyValue == null || typeof keyValue == 'undefined')
            keyValue = android;
        var access_token = this.getData('access_token');
        content += '&access_key=' + access_token + '&appkey=' + keyValue.key + '&mobi_app=android&platform=android&ts=' + this.getTs();
        content += "&sign=" + this.getSign(content, keyValue.secret);
        $.ajax({
            url: url,
            data: content,
            type: 'post',
            async: false,
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36'
            },
            success: function (data) {
                json = data;
            }
        });
        return json;
    },
    getApi: function (url, keyValue) {
        var json = null;
        if (keyValue == undefined || keyValue == null || typeof keyValue == 'undefined')
            keyValue = android;
        var access_token = this.getData('access_token');
        url += '&access_key=' + access_token + '&appkey=' + keyValue.key + '&platform=android&build=' + build + '&mobi_app=android&ts=' + this.getTs();
        url += "&sign=" + this.getSign(url, keyValue.secret);
        $.ajax({
            url: url,
            type: "get",
            async: false,
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36'
            },
            success: function (data) {
                json = data;
            }
        });
        return json;
    },
    getData: function (key) {
        try {
            var value = localStorage.getItem(key);
            if (value == undefined || typeof value == 'undefined' || value == null)
                value = '';
            return value;
        }
        catch (e) { }
        return '';
    },
    getSign: function (url, secret) {
        if (typeof secret == 'undefined')
            secret = androidSecret;
        var str = url.substring(url.indexOf("?", 4) + 1);
        var list = str.split('&');
        list.sort();
        var stringBuilder = '';
        for (var index = 0; index < list.length; index++) {
            stringBuilder += (stringBuilder.length > 0 ? '&' : '');
            stringBuilder += list[index];
        }
        stringBuilder += secret;
        var result = stringBuilder;
        result = md5(stringBuilder);
        return result.toLowerCase();
    },
    getTs: function () {
        var ts = new Date().getTime().toString();
        if (ts.length > 10)
            ts = ts.substring(0, 10);
        return ts;
    }
});

$(function () {
    $.initApi();
});