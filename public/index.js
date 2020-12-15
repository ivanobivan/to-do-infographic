const currentData = new Date().toJSON().slice(0, 10).replace(/(\d+)-(\d+)-(\d+)/, '$3-$2-$1');
let listData;
function showInfographic() {

}

window.TrelloPowerUp.initialize({
    "card-badges": function (t, opts) {
        return t.card("name")
            .then(function () {
                if (opts.attachments.addedData) {
                    return [];
                }
                opts.attachments.addedData = currentData;
                return [
                    {
                        text: "added: " + currentData,
                        color: "green"
                    }
                ];
            });
    },
    'board-buttons': function (t, opts) {
        return [
            {
                text: 'infographic',
                condition: 'always',
                callback: showInfographic
            }
        ]

    }
});

var t = window.TrelloPowerUp.iframe();
return t.lists("all")
    .then(function (lists) {
        console.log(lists);
        listData = lists;
    });
//lists.map(list => list.cards.map(card => card.attachments.addedData))