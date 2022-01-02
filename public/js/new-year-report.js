const t = window.TrelloPowerUp.iframe();


const main = () => {
	debugger
    const data = t.arg("data");
    const settings = t.arg("settings");
    const { headers, body } = data;
    const { startDate, endDate, list } = settings;

    setYear();

    const main = document.querySelector("main");

    headers.forEach((header, i) => {
        const section = document.createElement("section");
        section.className = "container";

        const headerNode = document.createElement("header");
        headerNode.innerText = header.toUpperCase();

        const container = document.createElement("div");
        container.className = "card-container";

        const cardList = body[i];
        for (let i = 0; i < cardList.length; i++) {
            const card = cardList[i];
            if (!card.closed) {
                continue;
            }

            const div = document.createElement("div");
            div.className = "card";

            div.onmouseover = (event) => {
                event.target.style.cssText = "transform: scale(1.2); opacity: 1";
            };

            div.onmouseout = (event) => {
                event.target.style.cssText = "transform: scale(1); opacity: 0.7";
            };

            div.innerText = `${card.name}\n${new Date(card.date).toDateString()}`;

            container.append(div);
        }

        const sumNode = document.createElement("div");
        sumNode.className = "sum";
        sumNode.innerText = `Всего выполнено ${container.childElementCount} элементов`;

        const imgContainerTop = document.createElement("div");
        imgContainerTop.className = "img-container";

        const imgContainer = document.createElement("div");
        imgContainer.className = "img-container";

        const imgTop = document.createElement("img");
        const img = document.createElement("img");

        if (header.includes("book")) {
            imgTop.src = "./public/img/book-2.png";
            img.src = "./public/img/book.png";
        } else if (header.includes("film")) {
            imgTop.src = "./public/img/film-2.png";
            img.src = "./public/img/film.png";
        } else if (header.includes("game")) {
            imgTop.src = "./public/img/game-2.png";
            img.src = "./public/img/game.png";
        } else if (header.includes("series")) {
            imgTop.src = "./public/img/series-2.png";
            img.src = "./public/img/series.png";
        }
        imgContainerTop.append(imgTop, imgTop.cloneNode());
        imgContainer.append(img, img.cloneNode());

        section.append(headerNode, imgContainerTop, sumNode, container, imgContainer);
        main.append(section);
    });

}

const setYear = () => {
    const yeadNode = document.getElementById("year");
    yeadNode.innerText = `ИТОГИ ГОДА 2021`;
}

main();