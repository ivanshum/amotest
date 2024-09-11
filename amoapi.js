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
    //Обновим данные теми что есть сейчас
    window.document.dispatchEvent(
      new CustomEvent('updateCards', {
        detail: {
          data: accumulatedData.concat(data?._embedded.leads),
          inprogress: !!data?._links?.next,
        },
      }),
    );
    if (data?._links?.next) {
      //Если есть еще данные, то ждем секунду, и идем за следующей пачкой
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return getLeads(
        page + 1,
        limit,
        accumulatedData.concat(data?._embedded.leads),
      );
    } else {
      //Все что смогли получить получили, возвращаем
      return accumulatedData.concat(data?._embedded.leads);
    }
  } catch (error) {
    console.error(
      'Упс! Что-то пошло не так :) Ошибки по разному обрабатывают, обычно...',
      error,
    );
  }
};

const getTaskByLeadId = async (id) => {
  try {
    const response = await amoapi.get(
      `/v4/tasks?filter%5Bentity_type%5D=leads&filter%5Bentity_id%5D=${id}`,
    );
    const data = response.data;
    if (data?._embedded?.tasks?.length) {
      //Вернем данные
      return data?._embedded?.tasks[0];
    } else {
      //Если задачи нет
      return {
        text: 'No task!',
        id: 'No id!',
        complete_till: false,
      };
    }
  } catch (error) {
    console.error(
      'Упс! Что-то пошло не так :) Ошибки по разному обрабатывают, обычно...',
      error,
    );
  }
};
export { getLeads, getTaskByLeadId };
