$(function () {
    var id = $.getQueryVar('id');
    var url = 'https://www.bilibili.com/read/mobile?id=' + id;
    $('#web').attr('src', url);
    document.activeElement.addEventListener('keydown', handleKeydown);
});
function handleKeydown(e) {
    switch (e.key) {
        case 'E':
        case 'Backspace':
        case 'SoftRight':
            window.location.href = '../index.html';
            break;
    }
}