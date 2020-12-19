
const SETTINGS_KEY = "SETTINGS_KEY";

const t = window.TrelloPowerUp.iframe();

//type settingsListElement = {name: string, id: string, checked: boolean};
//model settings: {list: [settingsListElement], startDate: Date(), endDate: Date()}

/*  
 * save user defined data in the private board info
 * @param {ClickEvent} event
 */
function save(event) {
    debugger
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
        .then(function(res) {
            return false;
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

    //set end date settings as current Date
    const endDate = document.getElementById("endDate");
    endDate.value = new Date().toISOString().slice(0, 10);

    //add save settings handler
    placeHolder.addEventListener("submit", save);
};

t.render(function () {
    //get main element from settings.html
    const settingDiv = document.getElementById("settings");

    //get settings
    return t.get("board", "private", SETTINGS_KEY)
        .then(function (settings) {

            //user already define custom settings
            if (settings) {
                return renderSettings(settingDiv, settings.list);
            } else {
                //settings doesn't extst, so, define new one
                return t.lists("id", "name")
                    .then(function (list) {
                        return renderSettings(settingDiv, list);
                    });
            }
        })
});
