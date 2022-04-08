export function storage<T>(key: string, initialValue: T) {
  function get() {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  }

  function set(value: T) {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  return {
    get,
    set,
  };
}
