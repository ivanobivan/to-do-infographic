const currentData = new Date().toJSON().slice(0, 10).replace(/(\d+)-(\d+)-(\d+)/, '$3-$2-$1');

function showInfographic() {

}

window.TrelloPowerUp.initialize({
    "card-badges": function (t, opts) {
        return [
            {
                text: "added: " + currentData,
                color: "green"
            }
        ];
    },
    "card-detail-badges": function (t, opts) {
        return [
            {
                text: "added: " + currentData,
                color: "green"
            }
        ];
    },
    'board-buttons': function (t, opts) {
        t.lists("all")
            .then(function (listData) {
                console.log(listData);
                /* return [
                    {
                        text: 'infographic',
                        condition: 'always',
                        callback: showInfographic
                    }
                ] */
            })

    }
});