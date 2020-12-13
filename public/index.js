window.TrelloPowerUp.initialize({
    "card-badges": function (t, opts) {
        let cardAttachments = opts.attachments;
        return t
            .card("name")
            .get("name")
            .then(function (cardName) {
                return [
                    {
                        text: "Added: " + new Date().toJSON().slice(0, 10).replace(/(\d+)-(\d+)-(\d+)/, '$3-$2-$1'),
                        color: "green"
                    },
                ];
            });
    },
});