
const SETTINGS_KEY = "SETTINGS_KEY";
const PUBLIC_POWERUP_KEY = "33dc42205aa39aa0357bf09d91c66226";
const PRIVATE_TOKEN_PATH = "PRIVATE_TOKEN_PATH";

function showInfographic(t, options) {
    return t.modal({
        url: './infographic.html',
        fullscreen: true,
        callback: () => t.closeModal(),
        title: 'Infographic'
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
    },
    'show-settings': function (t, options) {
        return t.popup({
            title: 'settings',
            url: './settings.html',
            height: 300
        });
    },
    'remove-data': function (t) {
        return t.remove("board", "private", SETTINGS_KEY)
            .then(function () {
                return t.clearSecret(PRIVATE_TOKEN_PATH);
            });
    },
    'show-authorization': function (t, options) {
        return t.popup({
            title: 'Authorization',
            args: {
                apiKey: PUBLIC_POWERUP_KEY,
            },
            url: './authorize.html',
            height: 140,
        });
    }
});

