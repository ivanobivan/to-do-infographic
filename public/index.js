
function showInfographic(t, options) {
    return t.lists("all")
        .then(function (lists) {
            return t.modal({
                url: './infographic.html',
                args: {
                    lists: lists
                },
                accentColor: 'lightblue',
                fullscreen: true,
                callback: () => t.closeModal(),
                title: 'Infographic'
            });
        });
};

window.TrelloPowerUp.initialize({
    'board-buttons': function (t, opts) {
        return [
            {
                text: 'infographic',
                condition: 'always',
                callback: () => showInfographic(t, opts)
            }
        ]
    },
    'show-settings': function (t, options) {
        return t.popup({
            title: 'settings',
            url: './settings.html',
            height: 300 // we can always resize later, but if we know the size in advance, its good to tell Trello
        });
    }
});

//нужно передеать имена списков, которые должны попасть в инфорграфику
//диапазон времени надо вывести прямо в html теле модального окна и навесить туда кнопку
//нужно передавать диапазон времени, за который нужно показать движение карточек
//это дата начала и дата конца
//в выбранном списке показывать только карточки, которые зарегистрированы после даты начала
//ну и не позже даты конца диапазона
//также передать список архивированных карточек
//также отфильтровать карточки, которые были удалены до даты окончания
//сложить количество карточек в списке =  общее количество карточек
//показать графику типа, это лист - столбец, вот в нем всего было 30 карточек заплонировано, из низ сделано 10 (зеленый), не сделано 20 (красный)


//lists.map(list => list.cards.map(card => card.attachments.addedData))