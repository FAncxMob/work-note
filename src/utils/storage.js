class HistoryStorage {
  setItem(key, value) {
    localStorage.setItem(key, value);
  }

  getItem(key) {
    return localStorage.getItem(key);
  }

  delete(key) {
    localStorage.removeItem(key);
  }
}

export default new HistoryStorage();
