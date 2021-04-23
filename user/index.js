let userId = 0;
$(function () {
    var id = localStorage.getItem('mid');
    if (typeof id != 'undefined' && id != null && id != '') {
        userId = parseInt(id);
        setUserInfo();
    }
    else {
        $('#softkey-left').text('登录');
        $(".login").show();
        $(".info").hide();
    }
    $.ajaxSettings.xhr = function () {
        try {
            return new XMLHttpRequest({ mozSystem: true });
        } catch (e) { }
    };
    document.activeElement.addEventListener('keydown', handleKeydown);
});

function handleKeydown(e) {
    if (e.key != "EndCall") {
        e.preventDefault();//清除默认行为（滚动屏幕等）
    }
    switch (e.key) {
        case 'ArrowUp':
            nav(-1);
            break;
        case 'ArrowDown':
            nav(1);
            break;
        case 'Q':
        case 'SoftLeft':
            if (userId == 0)
                login();
            else
                logout();
            break;
        case 'Backspace':
            window.location.href = '../index.html';
            break;
    }
}

function logout() {
    userId = 0;
    $(".info").hide();
    $(".login").show();
    $('#softkey-left').text('登录');
    localStorage.removeItem('mid');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('userInfo');
}

var current = -1;
function nav(move) {
    var next = current + move;
    const items = document.querySelectorAll('.item');
    if (next >= items.length) {
        next = items.length - 1;
    }
    else if (next < 0) {
        next = 0;
    }
    const targetElement = items[next];
    if (targetElement) {
        current = next;
        targetElement.focus();
    }
}

function login() {
    var name = $('#name').val();
    var pwd = $('#pwd').val();
    if (name == '' || pwd == '') {
        alert('账号或者密码不能为空！');
    }
    else {
        var ts = getTs();
        var passwd = encryptedPwd(pwd);
        console.log(passwd)
        var content = 'username=' + encodeURIComponent(name) + '&password=' + encodeURIComponent(passwd) + '&gee_type=10&appkey=' + tvKey + '&mobi_app=android&platform=android&ts=' + ts;
        content += "&sign=" + getSign(content, tvSecret);
        console.log(content)
        $.ajax({
            url: 'https://passport.bilibili.com/api/v3/oauth2/login',
            data: content,
            type: 'post',
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36'
            },
            success: function (data) {
                if (data.code == 0) {
                    var token = data.data.token_info;
                    userId = token.mid;
                    localStorage.setItem('mid', token.mid);
                    localStorage.setItem('access_token', token.access_token);
                    localStorage.setItem('refresh_token', token.refresh_token);
                    localStorage.setItem('expires_in', (token.expires_in + ts));
                    alert('登录成功！');
                    setUserInfo();
                }
                else {
                    alert('登录失败！' + data.message);
                }
            },
            error: function () {
                alert('登录失败！');
            }
        });
    }
}

function setUserInfo() {
    var access_token = localStorage.getItem('access_token');
    var userInfo = localStorage.getItem('userInfo');
    if (typeof userInfo == 'undefined' || userInfo == null || userInfo == '') {
        var url = 'https://app.bilibili.com/x/v2/space?access_key=' + access_token + '&appkey=' + androidKey + '&platform=wp&ps=10&ts=' + getTs() +
            '000&vmid=' + userId + '&build=' + build + '&mobi_app=android';
        url += "&sign=" + getSign(url);
        $.ajax({
            url: url,
            type: "get",
            async: false,
            headers: {
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36'
            },
            success: function (data) {
                userInfo = JSON.stringify(data);
                localStorage.setItem('userInfo', userInfo);
            }
        });
    }
    var info = JSON.parse(userInfo);
    if (info != null) {
        $('#face').attr('src', info.data.card.face);
        $('#uid').text('UID ' + info.data.card.mid);
        $('#uname').text(info.data.card.name);
        $('#exp').text('经验 ' + info.data.card.level_info.current_exp + ' / ' + info.data.card.level_info.next_exp);
        $('#lv').text('LV ' + info.data.card.level_info.current_level);
        $('#focus').text(' 关注 ' + info.data.card.attention);
        $('#fans').text(' 粉丝 ' + info.data.card.fans);
        $('#sign').text(info.data.card.sign);
    }
    $('#softkey-left').text('注销');
    $(".login").hide();
    $(".info").show();
}

function encryptedPwd(pwd) {
    var encrypted = pwd;
    var content = 'appkey=' + androidKey + '&mobi_app=android&platform=android&ts=' + getTs();
    content += "&sign=" + getSign(content);
    $.ajax({
        url: "https://passport.bilibili.com/api/oauth2/getKey",
        data: content,
        type: "post",
        async: false,
        headers: {
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36'
        },
        success: function (data) {
            if (data != null && data.code == 0) {
                var key = data.data.key;
                var hash = data.data.hash;
                key = key.replace(/\n/g, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '');
                var decrypt = new JSEncrypt();
                decrypt.setPublicKey(key);
                var hashPass = hash.concat(pwd);
                encrypted = decrypt.encrypt(hashPass);
                if (typeof encrypted == 'boolean' && encrypted == false) {
                    //加密失败，放弃挣扎吧
                    encrypted = pwd;
                }
            }
        }
    });
    return encrypted;
}