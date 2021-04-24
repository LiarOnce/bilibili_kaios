$(function () {


    document.activeElement.addEventListener('keydown', handleKeydown);
});

function handleKeydown(e) {
    switch (e.key) {
        case 'Enter':
            window.location.href = '../index.html';
            break;
        case 'E':
        case 'Backspace':
        case 'SoftRight':
            window.location.href = '../user/index.html';
            break;
    }
}