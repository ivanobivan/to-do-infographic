
const SETTINGS_KEY = "SETTINGS_KEY";

const t = window.TrelloPowerUp.iframe();

//type settingsListElement = {name: string, id: string, checked: boolean};
//model settings: {list: [settingsListElement], startDate: Date(), endDate: Date()}

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
    };

    t.set("board", "private", SETTINGS_KEY, settings)
        .then(function () {
            t.closePopup()
        });

    event.preventDefault();
}


/* *
 * add list elements into settings placeholder
 * @param {HtmlDivElement} placeHolder - where shoud add dom elements
 * @param {[settingsListElement]} list - collected list elements which indicate what list should to use depending by list id
 */
function renderSettings(placeHolder, list) {
    list.forEach(element => {

        const checkboxLabel = document.createElement("label");
        checkboxLabel.textContent = element.name;

        const checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        checkboxInput.checked = element.checked;
        checkboxInput.id = element.id;
        checkboxInput.name = element.name;

        checkboxLabel.appendChild(checkboxInput);

        placeHolder.appendChild(checkboxLabel);
    });
};

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

    const settingListDiv = document.getElementById("settings_list");

    //get settings
    return t.lists("id", "name")
        .then(function (list) {
            return t.get("board", "private", SETTINGS_KEY)
                .then(function (settings) {
                    //user already define a settings and list count didn't change
                    if (settings) {
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
