import './style.css';
import { getLeads, getTaskByLeadId } from './amoapi';

//получим цвет для кружочка по дате
function getColor(unixTimestamp) {
  if (!unixTimestamp) {
    return 'red';
  }

  const date = new Date(unixTimestamp * 1000); // Convert unix timestamp to milliseconds
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return 'green';
  } else if (date >= tomorrow) {
    return 'yellow';
  } else {
    return 'red';
  }
}

let openedcardid = ''; //Id открытой карточки
const cardClickHandler = (event) => {
  //Получаем карточку в которую кликнули
  const cardEl = event.target.closest('[id^="card-"]');
  //Скроем все в любом случае
  [...document.getElementsByClassName('taskcard')].forEach((element) => {
    element.classList.toggle('hidden', true);
  });
  //Все лоадеры тоже, а данные сбросим
  [...document.getElementsByClassName('taskloader')].forEach((element) => {
    element.classList.toggle('hidden', true);
  });
  [...document.getElementsByClassName('taskdata')].forEach((element) => {
    element.innerHTML = '';
  });
  //Если она и была открыта чистим переменную
  if (cardEl.id === openedcardid) {
    openedcardid = '';
  } else {
    //Если она была закрыта, то записываем её id и показываем карточку и лоадер
    openedcardid = cardEl.id;
    const childtaskcard = cardEl.querySelector('.taskcard');
    childtaskcard.classList.toggle('hidden', false);
    const childtaskloader = childtaskcard.querySelector('.taskloader');
    childtaskloader.classList.toggle('hidden', false);
    //Грузим данные
    getTaskByLeadId(cardEl.dataset.leadid)
      .then((data) => {
        //Скроем лоадер
        childtaskloader.classList.toggle('hidden', true);
        //Сохраним дату
        const date = new Date(data.complete_till);
        //Получим цвет статуса по дате
        const status = getColor(data.complete_till);
        //Подставляем данные
        const childtaskdata = childtaskcard.querySelector('.taskdata');
        childtaskdata.innerHTML = `                  
            <div class="text-sm">Название задачи:  ${data.text}</div>
            <div class="text-sm">id задачи:  ${data.id}</div>
            <div class="text-sm">Выполнить до:  ${date.toLocaleDateString(
              undefined,
              {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            )}</div> 
            <div class="p-2 w-2 h-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="fill-${status}-500 w-2 h-2">
                    <circle cx="50%" cy="50%" r="50%" />
                </svg>                
            </div>  
        `;
      })
      .catch((error) => {
        console.error(
          'Упс! Что-то пошло не так :) Ошибки по разному обрабатывают, обычно...',
          error,
        );
      });
  }
};

const updateMainUi = (data, state) => {
  document.getElementById('mainloader').classList.toggle('hidden', !state);
  const el = document.getElementById('maingrid');
  const loadedcards = document.querySelectorAll('[id^="card-"]');
  for (let index = loadedcards.length; index < data.length; index++) {
    const cardData = data[index];
    const card = document.createElement('div');
    card.id = `card-${cardData.id}`;
    card.dataset.leadid = cardData.id;
    card.className =
      'relative block w-full bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700';
    card.innerHTML = `
    <div class="p-6">
        <h2 class="text-base text-center">${cardData.name}</h2>
        <div class="text-sm">${cardData.price} €</div>
        <div class="text-xs text-gray-600 text-right">${cardData.id}</div>
    </div>
    <div class="taskcard hidden">
        <div class="absolute bottom-0 w-full bg-gray-200 rounded-b -translate-y-0 taskloader">
            <div style="width: 100%" class="absolute bottom-0 h-4 rounded-b cardloadbar"></div>
        </div>
        <div class="flex flex-col gap-2 text-center taskdata">
        </div>
    </div>`;
    card.addEventListener('click', cardClickHandler, false);
    el.appendChild(card);
  }
};

window.document.addEventListener('updateCards', (ev) =>
  updateMainUi(ev.detail.data || [], ev.detail.inprogress),
);

//Start app immidiatly
(async () => {
  window.document.dispatchEvent(
    new CustomEvent('updateCards', {
      detail: {
        inprogress: true,
      },
    }),
  );
  await getLeads();
})();
