((row, column, img) => {
    let elem = document.querySelector(`div#row-${row} div#column-${column}`);
    let image = document.createElement('img');
    image.setAttribute('src', `data:image/png;base64,${img}`);
    elem.appendChild(image);
    updateCount();
})