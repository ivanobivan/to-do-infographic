const token = window.location.hash.substring(7);

let key = "token";

localStorage.setItem(key, token);


setTimeout(function () { window.close(); }, 1000);