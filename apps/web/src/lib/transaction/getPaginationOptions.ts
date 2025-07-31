interface Params {
  currentPage?: number
  currentLimit?: number
}

function getPaginationOptions({
  currentPage,
  currentLimit,
}: Params) {
  return {
    page: currentPage || 1,
    limit: currentLimit || 30,
    date: new Date(),
    include: 'budget,category,concurrence',
  };
}

export default getPaginationOptions;
