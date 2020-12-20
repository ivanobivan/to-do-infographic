
const SETTINGS_KEY = "SETTINGS_KEY";
const PUBLIC_POWERUP_KEY = "33dc42205aa39aa0357bf09d91c66226";
const PRIVATE_TOKEN_PATH = "PRIVATE_TOKEN_PATH";
const BASE_URL = "https://trello.com/1/lists";

const t = window.TrelloPowerUp.iframe();

function stub(message) {
    const placeHolder = document.getElementById("infographic");
    placeHolder.innerText = message;
}

function renderInfographic(token, settings) {
    settings.list.forEach(element => {
        if (element.checked) {
            const requestUrl = `${BASE_URL}/${element.id}/cards/all?key=${PUBLIC_POWERUP_KEY}&token=${token}`;
            fetch(requestUrl, { method: "GET" })
                .then(function (res) {
                    return res.json();
                })
                .then(function (cardList) {
                    debugger;
                })
                .catch(function(err) {
                    debugger;
                })
        }
    });
    stub("loading...");
}

t.render(function () {
    t.loadSecret(PRIVATE_TOKEN_PATH)
        .then(function (token) {
            if (token) {
                t.get("board", "private", SETTINGS_KEY)
                    .then(function (settings) {
                        if (settings) {
                            renderInfographic(token, settings);
                        } else {
                            stub("Application settings aren't defined");
                        }
                    })
            } else {
                stub("Application isn't authorized");
            }
        });
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


//запросы

//иду по листу карточек, если checked, то делаем запрос (добавляем в запрос) 
// отфильтровали, которые не closed, после даты начала (dateLastActivity), которые closed до даты конца
//строим дом дерево как график, все количество будет красным цветом, которые выполнены - зеленым