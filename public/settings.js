const t = window.TrelloPowerUp.iframe();

t.render(function () {
    const settingElement = document.getElementById("settings");
    return t.lists("all")
        .then(function (lists) {
            lists.forEach(list => {
                const div = document.createElement("div");
            
                const span = document.createElement("span");
                span.textContent = list.name;
            
                const input = document.createElement("input");
                input.type = "checkbox";
                input.checked = true;

                div.appendChild(input);
                div.appendChild(span);
                
                settingElement.appendChild(div);
            })
        });
});
