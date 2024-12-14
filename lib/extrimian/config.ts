export const EXTRIMIAN_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_EXTRIMIAN_API_URL,
  apiKey: process.env.NEXT_PUBLIC_EXTRIMIAN_API_KEY,
  developerDid: process.env.NEXT_PUBLIC_EXTRIMIAN_DID,
};

// Utility to check if config is valid
export const isExtrimianConfigValid = () => {
  const isValid = !!(
    EXTRIMIAN_CONFIG.apiUrl &&
    EXTRIMIAN_CONFIG.apiKey &&
    EXTRIMIAN_CONFIG.developerDid
  );
  console.log("Config values:", {
    apiUrl: !!EXTRIMIAN_CONFIG.apiUrl,
    apiKey: !!EXTRIMIAN_CONFIG.apiKey,
    developerDid: !!EXTRIMIAN_CONFIG.developerDid,
  });
  return isValid;
};
