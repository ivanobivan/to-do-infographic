
const SETTINGS_KEY = "SETTINGS_KEY";
const PUBLIC_POWERUP_KEY = "33dc42205aa39aa0357bf09d91c66226";
const PRIVATE_TOKEN_PATH = "PRIVATE_TOKEN_PATH";
const BASE_URL = "https://trello.com/1/lists";

const t = window.TrelloPowerUp.iframe();

function stub(message) {
    const placeHolder = document.getElementById("infographic");
    placeHolder.innerText = message;
}

function clean() {
    const placeHolder = document.getElementById("infographic");
    placeHolder.innerHTML = "";
    placeHolder.innerText = "";
}

function createLinearDiv(id, innerText) {
    const linearDiv = document.createElement("div");
    linearDiv.className = "linear";
    if (innerText || innerText !== 0) {
        linearDiv.innerText = innerText;
    }
    if (id) {
        linearDiv.id = id;
    }
    return linearDiv;
}

function createListDiv(id, innerText, indicatorClass) {
    const list = document.createElement("div");
    list.className = "list";
    if (innerText || innerText !== 0) {
        list.innerText = innerText;
    }
    if (indicatorClass) {
        list.className += ` ${indicatorClass}`;
    }
    if (id) {
        list.id = id;
    }
    return list;
}

function generateUniqId() {
    return 'yxxxxxxx-yxxx-yxxx-yxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function buildDomTree(data) {
    const { headers, body, max } = data;

    const grid = [];

    const headersDomList = [];

    headersDomList.push(createLinearDiv("scaleLinear", "scale"));
    headers.forEach((header, index) => headersDomList.push(createListDiv(`${header}${index}`, header)));

    grid.push(headersDomList);

    /* what do we have now
        [
            [1, 2, 3, 4]
        ]
    */

    const OFFSET = 5;

    for (let i = 0; i < OFFSET; i++) {
        const divList = [];    
        divList.push(createLinearDiv(`offsetLinear${i}`, max + i));
        for (let j = 0; j < body.length; j++) {
            divList.push(createListDiv(`offsetList${i}${j}`));
        }
        grid.push(divList);
    }


    /* what do we have now
        [
            [1, 2, 3, 4] - header
            [1, 2, 3, 4] - offset
            [1, 2, 3, 4] - offset
            [1, 2, 3, 4] - offset
            [1, 2, 3, 4] - offset
            [1, 2, 3, 4] - offset
        ]
    */

    const bodyList = new Array(max);

    /* 
        what we'll get next in bodyList
    [
        [4], 
        [3], 
        [2], 
        [1], 
        [0]
    ] */
    for (let i = 1; i <= max; i++) {
        bodyList[i - 1] = [createLinearDiv(`bodyLinear${i}`, max - i)];
    }

    body.forEach(list => {
        while (list.length < bodyList.length) {
            list.unshift(null);
        }
        for (let i = 0; i < bodyList.length; i++) {
            const element = list[i];
            if (element) {
                if (element.closed) {
                    bodyList[i].push(createListDiv(element.id, element.name, "green"));
                } else {
                    bodyList[i].push(createListDiv(element.id, element.name, "red"));
                }
            } else {
                bodyList[i].push(createListDiv(generateUniqId()));
            }
        }

    });
    /* what we have here
        [4, elem, elem, elem], 
        [3, elem, elem, elem], 
        [2, elem, elem, elem], 
        [1, elem, elem, elem], 
        [0, elem, elem, elem], 
    */

    grid.push(...bodyList);
    render(grid, body.length);
}

function render(grid, gridColumnCount) {
    const infographic = document.getElementById("infographic");
    const header = document.createElement("header");
    header.innerText = "to-do-infographic";

    const footer = document.createElement("footer");

    const infographicMeasure = document.createElement("div");
    infographicMeasure.className = "infographic-measure";

    grid.forEach((list, index, array) => {
        if (index - 1 === array.length) {
            e.style.borderBottom = "none";
        }
        list.forEach(e => {
            infographicMeasure.appendChild(e);
        })
    });

    const explain = document.createElement("div");
    explain.className = "explain";
    explain.style.gridColumnStart = gridColumnCount + 2;
    explain.style.gridColumnEnd = gridColumnCount + 3;

    infographicMeasure.appendChild(explain);

    infographicMeasure.style.gridTemplateColumns = `0.5fr repeat(${gridColumnCount}, 1fr) 0.5fr`;
    infographicMeasure.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`;

    infographic.innerHTML = "";
    infographic.innerText = "";

    //append header
    infographic.appendChild(header);

    //append infographic data
    infographic.appendChild(infographicMeasure);

    //append footer
    infographic.appendChild(footer);
}

function getTimeMS(dateString) {
    return new Date(dateString).getTime();
}

function trimISODate(dateString) {
    return dateString.substring(0, 10);
}

function filterData(cardList, startDate, endDate) {
    const startTimeMS = getTimeMS(startDate);
    const endTimeMS = getTimeMS(endDate);
    cardList
        .filter(card => {
            if (!card.closed) {
                const dateLastActivityTimeMS = getTimeMS(trimISODate(card.dateLastActivity));
                return dateLastActivityTimeMS >= startTimeMS;
            }
            return true;
        })
        .filter(card => {
            if (card.closed) {
                const dueTimeMS = getTimeMS(trimISODate(card.dateLastActivity));
                return dueTimeMS <= endTimeMS;
            }
            return true;
        })
        .sort((a, b) => {
            if (a.closed && b.closed || !a.closed && !b.closed) {
                return a.date - b.date;
            } else if (a.closed) {
                return 1;
            }
            return -1;
        });
    return cardList.map(card => {
        return {
            id: card.id,
            date: getTimeMS(trimISODate(card.dateLastActivity)),
            name: card.name,
            closed: card.closed
        }
    })
}

function getDataForInfographic(token, settings) {
    stub("loading...");

    //what max card count it could get from all lists
    let MAX_CARD_COUNT = 0;
    const headers = [];

    if (settings.list && settings.list.length === 0) {
        return Promise.reject("No list is selected in the settings");
    }
    return Promise.all(
        settings.list.map(element => {
            return new Promise((resolve, reject) => {
                if (element.checked) {
                    headers.push(element.name);
                    const requestUrl = `${BASE_URL}/${element.id}/cards/all?key=${PUBLIC_POWERUP_KEY}&token=${token}`;
                    fetch(requestUrl, { method: "GET" })
                        .then(function (res) {
                            return res.json();
                        })
                        .then(function (cardList) {
                            const filteredList = filterData(cardList, settings.startDate, settings.endDate);
                            if (filteredList.length > MAX_CARD_COUNT) {
                                MAX_CARD_COUNT = filteredList.length;
                            }
                            resolve(filteredList);
                        })
                        .catch(function (err) {
                            reject(err);
                        })
                } else {
                    resolve(null);
                }
            });
        })
    ).then(result => {
        return {
            headers,
            body: result.filter(r => r !== null),
            max: MAX_CARD_COUNT
        }
    });
}

t.render(function () {
    clean();
    t.loadSecret(PRIVATE_TOKEN_PATH)
        .then(function (token) {
            if (token) {
                t.get("board", "private", SETTINGS_KEY)
                    .then(function (settings) {
                        if (settings) {
                            getDataForInfographic(token, settings)
                                .then(result => {
                                    buildDomTree(result);
                                }).catch(err => {
                                    stub(err.message);
                                });
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
