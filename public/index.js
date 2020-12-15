
function showInfographic(t, options) {
    return t.lists("all")
        .then(function (lists) {
            return t.modal({
                url: './infographic.html',
                args: {
                    text: 'Hello Ivan',
                    lists: lists
                },
                accentColor: '#F2D600',
                fullscreen: true,
                callback: () => t.closeModal(),
                title: 'Infographic'
            });
        });
};

window.TrelloPowerUp.initialize({
    'board-buttons': function (t, opts) {
        return [
            {
                text: 'infographic',
                condition: 'always',
                callback: () => showInfographic(t, opts)
            }
        ]
    }
});


//lists.map(list => list.cards.map(card => card.attachments.addedData))