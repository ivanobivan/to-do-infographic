
const SETTINGS_KEY = "SETTINGS_KEY";
const PUBLIC_POWERUP_KEY = "33dc42205aa39aa0357bf09d91c66226";
const PRIVATE_TOKEN_PATH = "PRIVATE_TOKEN_PATH";
const BASE_URL = "https://trello.com/1/lists";

const t = window.TrelloPowerUp.iframe();

function stub(message) {
    const placeHolder = document.getElementById("infographic");
    placeHolder.innerText = message;
}

function loading() {
    const placeHolder = document.getElementById("infographic");
    const loading = createDomElementWithOptions("img", "loading");
    loading.src = "https://to-do-infographic.vercel.app/resources/loading.gif";
    placeHolder.appendChild(loading);
}

function clean() {
    const placeHolder = document.getElementById("infographic");
    placeHolder.innerHTML = "";
    placeHolder.innerText = "";
}


function createDomElementWithOptions(elementType, className, id, innerText, indicatorClass, title, onClickHandler) {
    const domElement = document.createElement(elementType);
    if (className) {
        domElement.className = className;
    }
    if (id) {
        domElement.id = id;
    }
    if (innerText || innerText === 0) {
        domElement.innerText = innerText;
    }
    if (indicatorClass) {
        domElement.className += ` ${indicatorClass}`;
    }
    if (title) {
        domElement.title = title;
    }
    if (onClickHandler) {
        domElement.addEventListener("click", onClickHandler)
    }
    return domElement;
}

function createHeader() {
    return createDomElementWithOptions("header", "header", null, "to-do-infographic");
}

function createFooter() {
    return createDomElementWithOptions("footer", "footer");
}

function createLinearDiv(id, innerText, indicatorClass, title) {
    return createDomElementWithOptions("div", "linear", id, innerText, indicatorClass, title);
}

function createListDiv(id, innerText, indicatorClass, title, onClickHandler) {
    return createDomElementWithOptions("div", "list", id, innerText, indicatorClass, title, onClickHandler);
}

function createLegendDiv(circleAdditionalClass, spanText) {
    const legend = createDomElementWithOptions("div", "legend");
    if (circleAdditionalClass) {
        const circle = createDomElementWithOptions("div", "block", null, null, circleAdditionalClass);
        legend.appendChild(circle);
    }
    if (spanText) {
        const span = createDomElementWithOptions("span", null, null, spanText);;
        legend.appendChild(span);
    }
    return legend;
}

function createLegendWithCustomButton(className, text, handler) {
    const legend = createDomElementWithOptions("div", "legend");
    const button = createDomElementWithOptions("button", className, null, text, null, text, handler);
    legend.appendChild(button);
    return legend;
}

function createInfoDiv() {
    const info = createDomElementWithOptions("div", "info");
    info.appendChild(createDomElementWithOptions("span", null, null, "Information"));
    info.appendChild(createDomElementWithOptions("div", null, "cardInformation"));
    return info;
}

function createExplainDiv(startDate, endDate) {
    const explain = createDomElementWithOptions("div", "explain");

    //explain.appendChild(createLegendWithCustomButton("report", "Create report", createReportHandler));
    explain.appendChild(createLegendDiv("red", "Not done"));
    explain.appendChild(createLegendDiv("green", "Done"));
    explain.appendChild(createLegendDiv(null, `${startDate} - Date of start`));
    explain.appendChild(createLegendDiv(null, `${endDate} - Date of end`));
    explain.appendChild(createDomElementWithOptions("hr"));
    explain.appendChild(createInfoDiv());

    return explain;
}

function createReportHandler(event) {
    const infographic = document.getElementById("infographic");
    try {
        const styles = fetch("https://to-do-infographic.vercel.app/public/css/infographic.css");
        styles.then(res => {
            return res.text();
        }).then(style => {
            const content = `<div><style>${style}</style><div id="infographic">${infographic.innerHTML}</div></div>`;
            const link = document.createElement('a');
            link.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
            link.setAttribute("download", "infographic_report.html");

            link.style.display = 'none';
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
        });
    } catch (error) {
        console.error(error);
    }
}

function generateUniqId() {
    return 'yxxxxxxxyxxxyxxxyxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getCardInformation() {
    const cardInformation = document.getElementById("cardInformation");
    cardInformation.innerHTML = "";
    return cardInformation;
}

function onClickListElementHandler(element) {
    const cardInformation = getCardInformation();
    for (let key in element) {
        let text;
        if (key === "id") {
            continue;
        } else if (key === "date") {
            text = `${key} - ${new Date(element[key]).toDateString()}`;
        } else {
            text = `${key} - ${element[key]}`;
        }
        cardInformation.appendChild(createDomElementWithOptions("div", null, null, text));
    }
}

function onHeaderElementHandler(cardList, listName) {
    const cardInformation = getCardInformation();
    const notNullCardList = cardList.filter(card => card !== null);
    const closedCardList = notNullCardList.filter(card => card.closed);
    const percentage = notNullCardList.length > 0 ? Math.round((closedCardList.length / notNullCardList.length) * 100) : 0;
    cardInformation.appendChild(
        createDomElementWithOptions("div", null, null, `Card count in list [${listName}]: ${notNullCardList.length}`)
    );
    cardInformation.appendChild(
        createDomElementWithOptions("div", null, null, `Not done card count: ${notNullCardList.length - closedCardList.length}`)
    );
    cardInformation.appendChild(
        createDomElementWithOptions("div", null, null, `Done card count: ${closedCardList.length}`)
    );
    cardInformation.appendChild(
        createDomElementWithOptions("div", null, null, `Percentage of completion: ${percentage} %`)
    );

    const footer = document.getElementsByTagName("footer")[0];
    if (percentage > 0 && percentage < 50) {
        footer.innerText = "you're making progress";
    } else if (percentage >= 50 && percentage < 80) {
        footer.innerText = "you did a great job during this period";
    } else {
        footer.innerText = "you can be proud of yourself";
    }

}

function buildDomTree(data, settings) {
    const { headers, body, max } = data;
    const { startDate, endDate } = settings

    const grid = [];

    const headersDomList = [];

    headersDomList.push(createLinearDiv("scaleLinear", "scale", "header"));
    headers.forEach((header, index) => headersDomList.push(
        createListDiv(
            `${header}${index}`,
            header,
            "header",
            header,
            () => onHeaderElementHandler(body[index], header)
        )
    ));

    grid.push(headersDomList);

    /* what do we have now
        [
            [1, 2, 3, 4]
        ]
    */

    const OFFSET = 5;

    for (let i = 0; i < OFFSET; i++) {
        const divList = [];
        divList.push(createLinearDiv(`offsetLinear${i}`, (max + OFFSET - i - 1)));
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
                    bodyList[i].push(createListDiv(element.id, element.name, "green", element.name, () => onClickListElementHandler(element)));
                } else {
                    bodyList[i].push(createListDiv(element.id, element.name, "red", element.name, () => onClickListElementHandler(element)));
                }
            } else {
                bodyList[i].push(createListDiv(generateUniqId(), null, "empty", "card name isn't specified yet"));
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
    render(grid, body.length, startDate, endDate);
}

function render(grid, gridColumnCount, startDate, endDate) {
    clean();
    //main container
    const infographic = document.getElementById("infographic");

    const header = createHeader();

    const footer = createFooter();

    const infographicMeasure = document.createElement("div");
    infographicMeasure.className = "infographic-measure";

    grid.forEach((list, index, array) => {
        if (index + 1 === array.length) {
            list.forEach(e => {
                e.style.borderBottom = "none";
                infographicMeasure.appendChild(e);
            })
        } else {
            list.forEach(e => {
                infographicMeasure.appendChild(e);
            })
        }

    });

    infographicMeasure.style.gridTemplateColumns = `0.2fr repeat(${gridColumnCount}, 1fr)`;
    infographicMeasure.style.gridTemplateRows = `repeat(${grid.length}, 1fr)`;

    infographic.innerHTML = "";
    infographic.innerText = "";


    //append header
    infographic.appendChild(header);

    //append infographic data
    infographic.appendChild(infographicMeasure);

    //append explain
    infographic.appendChild(createExplainDiv(startDate, endDate));

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
    return cardList
        .filter(card => {
            const dateLastActivityTimeMS = getTimeMS(trimISODate(card.dateLastActivity));
            return dateLastActivityTimeMS >= startTimeMS && dateLastActivityTimeMS <= endTimeMS;
        })
        .sort((a, b) => {
            if (a.closed && b.closed || !a.closed && !b.closed) {
                return getTimeMS(b.dateLastActivity) - getTimeMS(a.dateLastActivity);
            } else if (a.closed) {
                return 1;
            }
            return -1;
        }).map(card => {
            return {
                id: card.id,
                date: getTimeMS(trimISODate(card.dateLastActivity)),
                name: card.name,
                closed: card.closed
            }
        });
}

function getDataForInfographic(token, settings) {
    loading();

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
                                    buildDomTree(result, settings);
                                }).catch(err => {
                                    console.error(err);
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
