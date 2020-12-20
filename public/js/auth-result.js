
const token = window.location.hash.substring(7);

let PRIVATE_TOKEN_PATH = "PRIVATE_TOKEN_PATH";
let key = "token";

localStorage.setItem(PRIVATE_TOKEN_PATH, token);

//setTimeout(function () { window.close(); }, 1000);