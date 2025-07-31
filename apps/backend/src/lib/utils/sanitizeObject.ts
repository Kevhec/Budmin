function sanitizeObject<
T extends Record<string, unknown>,
>(obj: T, keysToRemove: string[]) {
  if (!obj) {
    throw new Error('No object was provided');
  }

  const sanitizedObject = { ...obj };
  keysToRemove.forEach((key) => {
    delete sanitizedObject[key];
  });

  return sanitizedObject;
}

export default sanitizeObject;
