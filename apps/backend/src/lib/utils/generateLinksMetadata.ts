interface Params<T> {
  count: number
  rows: T[]
  offset: number
  limit: number
}

interface LinkMetadata {
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
  links: {
    first: string,
    previous: string | null,
    next: string | null,
    last: string,
  }
}

const backendUrl = process.env.BACKEND_URL;

function generateLinksMetadata<T>({
  count, rows, offset, limit = 10,
}: Params<T>): LinkMetadata {
  // Approach to JSON-API Standard
  const totalItems = count;
  const itemCount = rows.length;
  const itemsPerPage = limit;
  const totalPages = Math.ceil(count / itemsPerPage);
  const currentPage = Math.floor(offset / itemsPerPage) + 1;

  const first = `${backendUrl}/api/transaction/?offset=0&limit=${itemsPerPage}`;
  const previous = currentPage === 1
    ? null
    : `${backendUrl}/api/transaction/?offset=${offset - itemsPerPage}&limit=${itemsPerPage}`;
  const next = currentPage === totalPages
    ? null
    : `${backendUrl}/api/transaction/?offset=${offset + itemsPerPage}&limit=${itemsPerPage}`;
  const last = `${backendUrl}/api/transaction/?offset=${itemsPerPage * (totalPages - 1)}&limit=${limit}`;

  return {
    meta: {
      totalItems,
      itemCount,
      itemsPerPage,
      totalPages,
      currentPage,
    },
    links: {
      first,
      previous,
      next,
      last,
    },
  };
}

export default generateLinksMetadata;
