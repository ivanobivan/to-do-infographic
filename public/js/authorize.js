
const PRIVATE_TOKEN_PATH = "PRIVATE_TOKEN_PATH";

const Promise = TrelloPowerUp.Promise;
const t = TrelloPowerUp.iframe();

const apiKey = t.arg('apiKey');


const baseUrl = "https://trello.com/1/authorize";

let requestParameters = [
    ["expiration", "never"],
    ["name", "to-do-infographic"],
    ["scope", "read"],
    ["key", apiKey],
    ["callback_method", "fragment"],
    ["return_url", `${window.location.origin}%2Fauth-result.html`]
];

let parametersAsString = "";

for (let i = 0; i < requestParameters.length; i++) {
    const param = requestParameters[i];
    parametersAsString += `${param[0]}=${param[1]}`;
    if (i + 1 < requestParameters.length) {
        parametersAsString += "&";
    }
}

const trelloAuthUrl = `${baseUrl}?${parametersAsString}`;

const validateToken = function (token) {
    return /^[0-9a-f]{64}$/.test(token);
}

const storageHandler = function (event) {
    if (event.key === "token" && event.newValue && validateToken(event.newValue)) {
        t.storeSecret(PRIVATE_TOKEN_PATH, event.newValue);
        window.removeEventListener('storage', storageHandler);
    }
}

function authorize() {
    t.authorize(
        trelloAuthUrl,
        {
            height: 680,
            width: 580,
            validToken: validateToken,
            windowCallback: function (authorizeWindow) {
                window.addEventListener('storage', storageHandler);
            }
        }
    );
}

const button = document.getElementById('authorize_button')
button.addEventListener('click', authorize);
