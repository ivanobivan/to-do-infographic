const t = window.TrelloPowerUp.iframe();

const text = t.arg("text");
const lists = t.arg("lists");

t.render(function() {
    debugger
});

document.addEventListener('click', function (e) {
    if (e.target.tagName == 'BODY') {
        t.closeOverlay().done();
    }
});

document.addEventListener('keyup', function (e) {
    if (e.keyCode == 27) {
        t.closeOverlay().done();
    }
});

