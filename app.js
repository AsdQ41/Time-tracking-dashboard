async function getData(url='/data.json') {
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

class Dashboarditem {
    static PERIODS = {
        daily: 'day',
        weekly: 'week',
        monthly: 'month'
    }

    constructor(data, container = '.dashboard__content', view = 'weekly') {
        this.data = data;
        this.container = document.querySelector(container);
        this.view = view;

        this._createMarkup();
    }

    _createMarkup() {
        const {title, timeframes} = this.data;

        const id = title.toLowerCase().replace(/ /g, '-');
        const {current, previous} = timeframes[this.view.toLowerCase()];

        this.container.insertAdjacentHTML('beforeend', `
            <div class='dashboard__item dashboard__item--${id}'>
                <article class="traking-card">
                <header class="traking-card__header">
                    <h4 class="traking-card__title">${title}</h4>
                    <img src="./images/icon-ellipsis.svg" alt="menu" class="traking-card__menu">
                </header>
                <div class="traking-card__body">
                    <div class="traking-card__time">${current}hrs</div>
                    <div class="traking-card__prev-period">Last ${Dashboarditem.PERIODS[this.view]} - ${previous}hrs</div>
                </div>
                </article>
            </div>
        `);

        this.time = this.container.querySelector(`.dashboard__item--${id} .traking-card__time`);
        this.prev = this.container.querySelector(`.dashboard__item--${id} .traking-card__prev-period`)

    }

    changeView(view) {
        
        this.view = view.toLowerCase();
        const {current, previous} = this.data.timeframes[this.view.toLowerCase()];

        this.time.innerText = `${current}hrs`
        this.prev.innerText = `Last ${Dashboarditem.PERIODS[this.view]} - ${previous}hrs`
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getData()
        .then(data => {
            const activites = data.map(activiy => new Dashboarditem(activiy));

            const selectors = document.querySelectorAll('.select__item');
            selectors.forEach(selector => 
                selector.addEventListener('click', function() {
                    selectors.forEach(sel => sel.classList.remove('select__item--active'))
                    selector.classList.add('select__item--active');

                    const currentView = selector.innerText.trim().toLowerCase();

                    activites.forEach(activiy => activiy.changeView(currentView))
                })
            )
        })
})