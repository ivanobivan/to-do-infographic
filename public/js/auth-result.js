
const token = window.location.hash.substring(7);

localStorage.setItem("token", token);

setTimeout(function () { window.close(); }, 1000);