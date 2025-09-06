// Simple logger middleware for recording important events.
// Saves logs as an array in localStorage for persistence.

const LOGS_STORAGE_KEY = "urlShortenerLogs";

export const logEvent = (details) => {
  try {
    const existingLogs = JSON.parse(localStorage.getItem(LOGS_STORAGE_KEY)) || [];
    const timestampedEntry = { ...details, timestamp: new Date().toISOString() };
    existingLogs.push(timestampedEntry);
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(existingLogs));
    // Optional: console.debug("Logged event:", timestampedEntry)
  } catch (err) {
    console.warn("Failed to log event", err);
  }
};

export const getAllLogs = () => {
  try {
    return JSON.parse(localStorage.getItem(LOGS_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};
