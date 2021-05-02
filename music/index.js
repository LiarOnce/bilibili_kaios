$(function () {
    loadData();
    document.activeElement.addEventListener('keydown', handleKeydown);
});
function loadData() {

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