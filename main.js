import './style.css';
import { getLeads } from './amoapi';

const updateMainUi = (data, state) => {
  document.getElementById('mainloader').classList.toggle('hidden', !state);
  const el = document.getElementById('maingrid');
  const loadedcards = document.querySelectorAll('[id^="card-"]');
  for (let index = loadedcards.length; index < data.length; index++) {
    const cardData = data[index];
    const card = document.createElement('div');
    card.id = 'card-';
    card.className =
      'block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700';
    card.innerHTML = `
        <h2 class="text-base text-center">${cardData.name}</h2>
        <div class="text-sm">${cardData.price} €</div>
        <div class="text-xs text-gray-400 text-right">${cardData.id}</div>`;
    el.appendChild(card);
  }
};

window.document.addEventListener('updateCards', (ev) =>
  updateMainUi(ev.detail.data, ev.detail.inprogress),
);

window.document.dispatchEvent(
  new CustomEvent('updateCards', {
    detail: {
      inprogress: true,
    },
  }),
);
getLeads().then((res) => console.log(res));
