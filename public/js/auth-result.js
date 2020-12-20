const token = window.location.hash.substring(7);
debugger
if (window.opener) {
    window.opener.authorize(token);
} else {
    localStorage.setItem('token', token);
}

setTimeout(function () { window.close(); }, 1000);