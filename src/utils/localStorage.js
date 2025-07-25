export const STORAGE_KEYS = {
  CALENDARS: 'calendar-app-calendars',
  EVENTS: 'calendar-app-events',
  DATE_STATE: 'calendar-app-date-state',
  SHARE_PREFIX: 'share_',
  SHARE_EXPIRY_SUFFIX: '_exp',
};

export const storage = {
  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
      return false;
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
      return false;
    }
  },

  getRawItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading raw from localStorage (key: ${key}):`, error);
      return null;
    }
  },

  setRawItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing raw to localStorage (key: ${key}):`, error);
      return false;
    }
  },

  hasItem(key) {
    return localStorage.getItem(key) !== null;
  },

  clearAppData() {
    Object.values(STORAGE_KEYS).forEach((key) => {
      if (key !== STORAGE_KEYS.SHARE_PREFIX) {
        this.removeItem(key);
      }
    });
  },

  getAllKeys() {
    return Object.keys(localStorage);
  },
};

export const shareStorage = {
  saveSharedEvent(shortId, encryptedData, expiryDays = 7) {
    const storageKey = `${STORAGE_KEYS.SHARE_PREFIX}${shortId}`;
    const expiryKey = `${storageKey}${STORAGE_KEYS.SHARE_EXPIRY_SUFFIX}`;
    const expiryTime = Date.now() + expiryDays * 24 * 60 * 60 * 1000;

    const dataStored = storage.setRawItem(storageKey, encryptedData);
    const expiryStored = storage.setRawItem(expiryKey, expiryTime.toString());

    return dataStored && expiryStored;
  },

  getSharedEvent(shortId) {
    const storageKey = `${STORAGE_KEYS.SHARE_PREFIX}${shortId}`;
    const expiryKey = `${storageKey}${STORAGE_KEYS.SHARE_EXPIRY_SUFFIX}`;

    const expiryTime = storage.getRawItem(expiryKey);
    if (expiryTime && Date.now() > parseInt(expiryTime)) {
      storage.removeItem(storageKey);
      storage.removeItem(expiryKey);
      return null;
    }

    return storage.getRawItem(storageKey);
  },

  removeSharedEvent(shortId) {
    const storageKey = `${STORAGE_KEYS.SHARE_PREFIX}${shortId}`;
    const expiryKey = `${storageKey}${STORAGE_KEYS.SHARE_EXPIRY_SUFFIX}`;

    storage.removeItem(storageKey);
    storage.removeItem(expiryKey);
  },

  cleanupExpiredShares() {
    const keys = storage.getAllKeys();
    const now = Date.now();
    let cleanedCount = 0;

    keys.forEach((key) => {
      if (key.startsWith(STORAGE_KEYS.SHARE_PREFIX) && key.endsWith(STORAGE_KEYS.SHARE_EXPIRY_SUFFIX)) {
        const expiryTime = parseInt(storage.getRawItem(key));
        if (now > expiryTime) {
          const dataKey = key.replace(STORAGE_KEYS.SHARE_EXPIRY_SUFFIX, '');
          storage.removeItem(dataKey);
          storage.removeItem(key);
          cleanedCount++;
        }
      }
    });

    return cleanedCount;
  },

  getShareStats() {
    const keys = storage.getAllKeys();
    const shareKeys = keys.filter(
      (key) => key.startsWith(STORAGE_KEYS.SHARE_PREFIX) && !key.endsWith(STORAGE_KEYS.SHARE_EXPIRY_SUFFIX)
    );

    return {
      total: shareKeys.length,
      keys: shareKeys,
    };
  },
};
