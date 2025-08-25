import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  // Подготовка шаблона кнопки для страницы и очистка контейнера
  const pageTemplate = pages.firstElementChild.cloneNode(true); // в качестве шаблона берём первый элемент из контейнера со страницами
  pages.firstElementChild.remove(); // и удаляем его

  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // Обработка действий
    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break; // переход на предыдущую страницу
        case "next":
          page = Math.min(pageCount, page + 1);
          break; // переход на следующую страницу
        case "first":
          page = 1;
          break; // переход на первую страницу
        case "last":
          page = pageCount;
          break; // переход на последнюю страницу
      }
    }

    return Object.assign({}, query, {
      // добавляем параметры к query, но не изменяем исходный объект
      limit,
      page,
    });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    // Получаем массив страниц, которые нужно показать, выводим только 5 страниц
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        // создаём для них кнопку
        const el = pageTemplate.cloneNode(true); // клонируем шаблон
        return createPage(el, pageNumber, pageNumber === page); // заполняем кнопку данными
      })
    );

    // Обновляем статус пагинации
    fromRow.textContent = (page - 1) * limit + 1; // С какой строки выводим
    toRow.textContent = Math.min(page * limit, total); // До какой строки выводим
    totalRows.textContent = total; // Сколько всего строк выводим на всех страницах вместе
  };

  return {
    updatePagination,
    applyPagination,
  };
};
