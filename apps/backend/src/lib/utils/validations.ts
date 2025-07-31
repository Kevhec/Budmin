interface DoExist {
  error: boolean,
  errorElements: string[],
}

function isInt(number: string) {
  const parsedNumber = parseInt(number, 10);
  return !Number.isNaN(parsedNumber);
}

function dontExist(elements: Record<string, unknown>): DoExist {
  let error = false;
  const errorElements: string[] = [];

  Object.entries(elements).forEach((entry) => {
    const key = entry[0];
    const value = entry[1];

    if (!value) {
      errorElements.push(key);
      error = true;
    }
  });

  return {
    error,
    errorElements,
  };
}

export {
  isInt,
  dontExist,
};
