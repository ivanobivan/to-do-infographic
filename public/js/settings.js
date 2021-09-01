const SETTINGS_KEY = "SETTINGS_KEY";
const SETTINGS_TABLE_SELECTOR = "#settings_list tbody";

const t = window.TrelloPowerUp.iframe();

//type settingsListElement = {name: string, id: string, checked: boolean};
//model settings: {list: [settingsListElement], startDate: Date(), endDate: Date()}

function setSettingsDateControlValueFromSelectedRange(event) {
    const inputStartDate = document.getElementById("startDate");
    const inputEndDate = document.getElementById("endDate");
    if (inputStartDate && inputEndDate) {
        const now = new Date();
        const desired = new Date();
        switch (event.value) {
            case "DAY":
                desired.setDate(now.getDate() - 1);
                break;
            case "WEEK":
                desired.setDate(now.getDate() - 7);
                break;
            case "MONTH":
                desired.setMonth(now.getMonth() - 1);
                break;
            case "YEAR":
                desired.setFullYear(now.getFullYear() - 1);
                break;
            case "BEGIN":
                now.setMonth(11);
                now.setDate(31);
                desired.setMonth(0);
                desired.setDate(1);
            case "EMPTY":
            default:
                break
        }
        inputEndDate.value = now.toISOString().substring(0, 10);
        inputStartDate.value = desired.toISOString().substring(0, 10);
    }
}


function getContentFromHtmlElement(htmlElement, parameter) {
    return parameter ? htmlElement[parameter] : htmlElement.value;
}

/*  
 * save user defined data in the private board info
 * @param {ClickEvent} event
 */
function save(event) {

    const form = document.getElementById("settings");
    const trList = form.querySelectorAll("#settings_list > tbody > tr");
    const list = [];
    trList.forEach(trElement => {
        const select = getContentFromHtmlElement(trElement.querySelector(".list-period"), "selectedOptions");
        list.push({
            id: getContentFromHtmlElement(trElement.querySelector(".list-enable"), "id"),
            checked: getContentFromHtmlElement(trElement.querySelector(".list-enable"), "checked"),
            name: getContentFromHtmlElement(trElement.querySelector(".list-name"), "textContent"),
            count: getContentFromHtmlElement(trElement.querySelector(".list-count")),
            period: select[0].value
        })
    });
    const settings = {
        startDate: getContentFromHtmlElement(form.querySelector("#startDate")),
        endDate: getContentFromHtmlElement(form.querySelector("#endDate")),
        list
    }

    t.set("board", "private", SETTINGS_KEY, settings)
        .then(function () {
            t.closePopup()
        });

    event.preventDefault();
}

function overrideSettingsDate(startDateValue, endDateValue) {
    const startDate = document.getElementById("startDate");
    startDate.value = startDateValue;

    const endDate = document.getElementById("endDate");
    endDate.value = endDateValue;
}

function wrapHtmlElementTr(htmlElement) {
    const td = document.createElement("td");
    td.append(htmlElement);
    return td;
}

function getPeriodSelectDomElement() {
    const select = document.createElement("select");
    select.className = "list-period";
    const list = ["day", "week", "month", "year"];
    select.append(...list.map(e => {
        const option = document.createElement("option");
        option.value = e;
        option.textContent = e;
        return option;
    }));
    return select;
}

/* *
 * add list elements into settings placeholder
 * @param {HtmlDivElement} placeHolder - where shoud add dom elements
 * @param {[settingsListElement]} list - collected list elements which indicate what list should to use depending by list id
 */
function renderSettings(placeHolder, list) {
    list.forEach(element => {
        const tr = document.createElement("tr");

        const checkboxLabel = document.createElement("label");
        checkboxLabel.textContent = element.name;
        checkboxLabel.htmlFor = element.id;
        checkboxLabel.className = "list-name";

        const checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        checkboxInput.checked = element.checked;
        checkboxInput.id = element.id;
        checkboxInput.className = "list-enable";

        const elementCountContainerInput = document.createElement("input");
        elementCountContainerInput.type = "number";
        elementCountContainerInput.className = "list-count";

        tr.append(
            wrapHtmlElementTr(checkboxLabel),
            wrapHtmlElementTr(checkboxInput),
            wrapHtmlElementTr(elementCountContainerInput),
            wrapHtmlElementTr(getPeriodSelectDomElement())
        );

        placeHolder.appendChild(tr);
    });
}

/* 
 * clean list element, set default end date value and resubscribe submit event
 */
function prepareSettingsElement() {
    const settingDiv = document.getElementById("settings");

    const settingListTable = document.querySelector(SETTINGS_TABLE_SELECTOR);

    //event submit (mean save settings) pulls event rerender cos I should clean element list 
    settingListTable.innerHTML = "";

    //set end date settings as current Date
    const endDate = document.getElementById("endDate");
    endDate.value = new Date().toISOString().slice(0, 10);

    settingDiv.removeEventListener("submit", save);
    settingDiv.addEventListener("submit", save);
}

t.render(function () {

    prepareSettingsElement();

    const settingListTable = document.querySelector(SETTINGS_TABLE_SELECTOR);

    //get settings
    return t.lists("id", "name")
        .then(function (list) {
            return t.get("board", "private", SETTINGS_KEY)
                .then(function (settings) {
                    //user already define a settings and list count didn't change
                    if (settings) {
                        overrideSettingsDate(settings.startDate, settings.endDate);
                        if (settings.list.length === list.length) {
                            return renderSettings(settingListTable, settings.list);
                        } else {
                            //settings defined, but user list count updated, so merge it to one list
                            const mergedList = list.map(element => {
                                const sElement = settings.list.find(e => e.id === element.id);
                                const checked = sElement && sElement.checked;
                                return {
                                    id: element.id,
                                    name: element.name,
                                    checked
                                }

                            });
                            return renderSettings(settingListTable, mergedList);
                        }

                    } else {
                        //settings doesn't exist
                        return renderSettings(settingListTable, list);
                    }
                })
        });
});
