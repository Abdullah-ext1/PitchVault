const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const parsePagination = (page, limit) => {
  const parsedPage = parseInt(page) || DEFAULT_PAGE;
  const parsedLimit = parseInt(limit) || DEFAULT_LIMIT;

  if (parsedPage < 1) {
    throw new Error("Page must be at least 1");
  }

  const clampedLimit = Math.min(parsedLimit, MAX_LIMIT);

  return {
    page: parsedPage,
    limit: clampedLimit,
    skip: (parsedPage - 1) * clampedLimit,
  };
};

export const buildPaginationResponse = (items, totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    pagination: {
      totalItems,
      limit,
      currentPage: page,
      totalPages,
    },
  };
};
