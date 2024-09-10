import axios from 'axios';

const amoapi = axios.create({
  baseURL: '/api',
  headers: { Authorization: `Bearer ${import.meta.env.VITE_ACCESSTOKEN}` },
  withCredentials: true,
});

const getLeads = async (page = 1, limit = 3, accumulatedData = []) => {
  try {
    const response = await amoapi.get(`/v4/leads?page=${page}&limit=${limit}`);
    const data = response.data;
    window.document.dispatchEvent(
      new CustomEvent('updateCards', {
        detail: {
          data: accumulatedData.concat(data._embedded.leads),
          inprogress: !!data?._links?.next,
        },
      }),
    );
    if (data?._links?.next) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getLeads(
        page + 1,
        limit,
        accumulatedData.concat(data._embedded.leads),
      );
    } else {
      return accumulatedData.concat(data._embedded.leads);
    }
  } catch (error) {
    console.error(
      'Упс! Что-то пошло не так :) Ошибки по разному обрабатывают, обычно...',
      error,
    );
  }
};

export { getLeads };
