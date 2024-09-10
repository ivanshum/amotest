import './style.css';
import { getLeads } from './amoapi';

window.document.addEventListener('updateCards', (ev) => console.log(ev.detail));
window.document.dispatchEvent(
  new CustomEvent('updateCards', {
    detail: {
      inprogress: true,
    },
  }),
);
getLeads().then((res) => console.log(res));
