const parseColor = (color) => {
  if (!color) return null;

  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length !== 6) return null;
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }

  if (color.startsWith('rgb')) {
    const values = color.match(/[\d.]+/g);
    if (values && values.length >= 3) {
      return {
        r: parseInt(values[0]),
        g: parseInt(values[1]),
        b: parseInt(values[2]),
      };
    }
  }

  return null;
};

export const darkenColor = (color, amount = 0.2) => {
  const parsed = parseColor(color);
  if (!parsed) return color;

  const { r, g, b } = parsed;
  const darkenedR = Math.max(0, r - Math.round(255 * amount));
  const darkenedG = Math.max(0, g - Math.round(255 * amount));
  const darkenedB = Math.max(0, b - Math.round(255 * amount));

  return `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
};

export const addOpacity = (color, opacity = 0.4) => {
  const parsed = parseColor(color);
  if (!parsed) return color;

  const { r, g, b } = parsed;

  const saturationBoost = 1 + (1 - opacity) * 0.1;

  const enhancedR = Math.min(255, Math.round(r * saturationBoost));
  const enhancedG = Math.min(255, Math.round(g * saturationBoost));
  const enhancedB = Math.min(255, Math.round(b * saturationBoost));

  return `rgba(${enhancedR}, ${enhancedG}, ${enhancedB}, ${opacity})`;
};
