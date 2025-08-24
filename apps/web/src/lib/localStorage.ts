function setItem<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getItem<T = any>(key: string) {
  const value = window.localStorage.getItem(key);
  return value ? JSON.parse(value) as T : null;
}

function removeItem(key: string) {
  window.localStorage.removeItem(key);
}

export {
  setItem,
  getItem,
  removeItem,
};
