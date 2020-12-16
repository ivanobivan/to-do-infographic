const t = window.TrelloPowerUp.iframe();

const lists = t.arg("lists");

t.render(function() {
    console.log(lists);
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

