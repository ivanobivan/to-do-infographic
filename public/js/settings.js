const SETTINGS_KEY = "SETTINGS_KEY";

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


/*  
 * save user defined data in the private board info
 * @param {ClickEvent} event
 */
function save(event) {

    const form = document.getElementById("settings");

    const formElements = form.elements;

    const settings = {
        startDate: null,
        endDate: null,
        list: []
    }

    for (let i = 0; i < formElements.length; i++) {
        const input = formElements[i];
        if (input.type === "submit") {
            continue;
        } else if (input.name === "startDate") {
            settings.startDate = input.value;
        } else if (input.name === "endDate") {
            settings.endDate = input.value;
        } else {
            settings.list.push({
                id: input.id,
                checked: input.checked,
                name: input.name
            })
        }
    }
    ;

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

function getTimeSelectDomElement() {
    const select = document.createElement("select");
    select.name = "timeSelect";
    const list = ["day", "week", "month", "year"];
    select.append(...list.map(e => {
        const option = document.createElement("option");
        option.value = e;
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

        const checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        checkboxInput.checked = element.checked;
        checkboxInput.id = element.id;
        checkboxInput.name = element.name;

        const speedContainerInput = document.createElement("input");
        speedContainerInput.type = "number";
        speedContainerInput.name = "speedContainerInput";

        tr.append(
            wrapHtmlElementTr(checkboxLabel),
            wrapHtmlElementTr(checkboxInput),
            wrapHtmlElementTr(speedContainerInput),
            wrapHtmlElementTr(getTimeSelectDomElement())
        );

        placeHolder.appendChild(tr);
    });
}

/* 
 * clean list element, set default end date value and resubscribe submit event
 */
function prepareSettingsElement() {
    const settingDiv = document.getElementById("settings");

    const settingListDiv = document.getElementById("settings_list");

    //event submit (mean save settings) pulls event rerender cos I should clean element list 
    settingListDiv.innerHTML = "";

    //set end date settings as current Date
    const endDate = document.getElementById("endDate");
    endDate.value = new Date().toISOString().slice(0, 10);

    settingDiv.removeEventListener("submit", save);
    settingDiv.addEventListener("submit", save);
}

t.render(function () {

    prepareSettingsElement();

    const settingListDiv = document.getElementById("settings_list tbody");

    //get settings
    return t.lists("id", "name")
        .then(function (list) {
            return t.get("board", "private", SETTINGS_KEY)
                .then(function (settings) {
                    //user already define a settings and list count didn't change
                    if (settings) {
                        overrideSettingsDate(settings.startDate, settings.endDate);
                        if (settings.list.length === list.length) {
                            return renderSettings(settingListDiv, settings.list);
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
                            return renderSettings(settingListDiv, mergedList);
                        }

                    } else {
                        //settings doesn't exist
                        return renderSettings(settingListDiv, list);
                    }
                })
        });
});
