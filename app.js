const build = '5442100';
const androidKey = '1d8b6e7d45233436';
const androidSecret = '560c52ccd288fed045859ed18bffd973';
const tvKey = '4409e2ce8ffd12b8';
const tvSecret = '59b43e04ad6965f34319062b478f83dd';

function getSign(url, secret) {
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
    var result = toMd5(stringBuilder);
    return result.toLowerCase();
}

function toMd5(input) {
    var output = input;
    try {
        output = md5(input);
    }
    catch (e) {
        console.log(e);
    }
    return output;
}

function getTs() {
    var ts = new Date().getTime().toString();
    if (ts.length > 10)
        ts = ts.substring(0, 10);
    return ts;
}