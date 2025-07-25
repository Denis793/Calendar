import { shareStorage } from '@/utils/localStorage';

const ENCRYPTION_KEY = 'calendar-share-2025';

function simpleEncrypt(text, key) {
  let result = '';
  const encodedText = encodeURIComponent(text);

  for (let i = 0; i < encodedText.length; i++) {
    const charCode = encodedText.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }

  return btoa(unescape(encodeURIComponent(result)));
}

function simpleDecrypt(encryptedText, key) {
  try {
    const decoded = decodeURIComponent(escape(atob(encryptedText)));
    let result = '';

    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }

    return decodeURIComponent(result);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}

function generateShortId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createSecureShareLink(eventData) {
  const baseUrl = window.location.origin + window.location.pathname;

  const compactData = {
    id: eventData.id,
    t: eventData.title,
    d: eventData.date,
    st: eventData.startTime,
    et: eventData.endTime,
    cid: eventData.calendarId,
    ...(eventData.description && { desc: eventData.description }),
    ...(eventData.color && { c: eventData.color }),
    ...(eventData.repeat && { r: eventData.repeat }),
    a: eventData.allDay,
  };

  const jsonData = JSON.stringify(compactData);
  const encryptedData = simpleEncrypt(jsonData, ENCRYPTION_KEY);

  const shortId = generateShortId();

  const success = shareStorage.saveSharedEvent(shortId, encryptedData, 7);

  if (!success) {
    console.error('Failed to save shared event to localStorage');
    return null;
  }

  return `${baseUrl}?s=${shortId}`;
}

export function parseSecureShareLink(shortId) {
  try {
    const encryptedData = shareStorage.getSharedEvent(shortId);
    if (!encryptedData) {
      return null;
    }

    const decryptedJson = simpleDecrypt(encryptedData, ENCRYPTION_KEY);
    if (!decryptedJson) {
      return null;
    }

    const compactData = JSON.parse(decryptedJson);

    return {
      id: compactData.id,
      title: compactData.t,
      date: compactData.d,
      startTime: compactData.st,
      endTime: compactData.et,
      calendarId: compactData.cid,
      description: compactData.desc || '',
      color: compactData.c || '',
      repeat: compactData.r || '',
      allDay: compactData.a,
    };
  } catch (error) {
    console.error('Error parsing secure share link:', error);
    return null;
  }
}

export function cleanupExpiredLinks() {
  return shareStorage.cleanupExpiredShares();
}
