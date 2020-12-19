
const PRIVATE_TOKEN_PATH = "PRIVATE_TOKEN_PATH";

const Promise = TrelloPowerUp.Promise;
const t = TrelloPowerUp.iframe();

const apiKey = t.arg('apiKey');



const baseUrl = "https://trello.com/1/authorize";
const requestParameters = [
    ["expiration", "never"],
    ["name", "to-do-infographic"],
    ["scope", "read"],
    ["key", "apiKey"],
    ["callback_method", "postMessage"],
    ["response_type", "token"]
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

function validateToken(token) {
    return /^[0-9a-f]{64}$/.test(token);
}

function authorize() {
    t.authorize(trelloAuthUrl, { height: 100, width: 200, validToken: validateToken })
        .then(function (token) {
            return t.storeSecret(PRIVATE_TOKEN_PATH, token);
        })
        .then(function () {
            return t.closePopup();
        });
}

t.render(function() {
    debugger
    const button = document.getElementById('authorize_button')
    button.addEventListener('click', authorize);
})

