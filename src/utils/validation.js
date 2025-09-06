// Validation helpers for URL, shortcode, and numeric inputs

// Checks if a string is a syntactically valid URL (with http or https)
export const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

// Shortcode must be alphanumeric, between 1 and 10 characters
export const isValidShortcode = (code) => /^[a-zA-Z0-9]{1,10}$/.test(code);

// Validity must be a positive integer number (e.g., 1, 30)
export const isValidInteger = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};
