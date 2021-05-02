let sid = 0;
$(function () {
    sid = $.getQueryVar('id');
    loadData();
    document.activeElement.addEventListener('keydown', handleKeydown);
});
function loadData() {
    var mid = $.getData('mid');
    var url = 'https://api.bilibili.com/audio/music-service-c/songs/playing?mid=' + mid + '&song_id=' + sid;
    var result = $.getApi(url);
    console.log(result)
}
function handleKeydown(e) {
    switch (e.key) {
        case 'ArrowUp':
            nav(-1);
            break;
        case 'ArrowDown':
            nav(1);
            break;
        case 'Enter':
            break;
        case 'Q':
        case 'SoftLeft':

            break;
        case 'E':
        case 'Backspace':
        case 'SoftRight':
            window.location.href = '../index.html';
            break;
    }
}