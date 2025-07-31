// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renameObjectKey(obj: Record<any, any>, oldKey: string, newKey: string) {
  const objCopy = structuredClone(obj);

  if (oldKey !== newKey) {
    const descriptor = Object.getOwnPropertyDescriptor(objCopy, oldKey);

    if (descriptor) {
      // Modify old key
      Object.defineProperty(
        objCopy,
        newKey,
        descriptor,
      );
    }

    // Delete old key
    delete objCopy[oldKey];
  }

  return objCopy;
}

export default renameObjectKey;
