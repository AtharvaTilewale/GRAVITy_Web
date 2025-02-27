// Script to resize viewer window

const leftPane = document.querySelector('.left_pane');
const resizer = document.querySelector('.resizer');

resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
});

function resize(e) {
    let newWidth = e.clientX / window.innerWidth * 100;
    if (newWidth >= 20 && newWidth <= 50) {
        leftPane.style.width = newWidth + '%';
    }
}

function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}