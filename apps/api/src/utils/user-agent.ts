type UaDetails = {
  browser: string;
  os: string;
  deviceType: string;
};

const detectBrowser = (ua: string): string => {
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\//i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua)) return "Chrome";
  if (/Firefox\//i.test(ua)) return "Firefox";
  if (/Safari\//i.test(ua)) return "Safari";
  if (/MSIE|Trident\//i.test(ua)) return "IE";
  return "Unknown";
};

const detectOs = (ua: string): string => {
  if (/Windows NT/i.test(ua)) return "Windows";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unknown";
};

const detectDeviceType = (ua: string): string => {
  if (/iPad|Tablet/i.test(ua)) return "TABLET";
  if (/Mobile|Android|iPhone|iPod/i.test(ua)) return "MOBILE";
  return "DESKTOP";
};

export const parseUserAgent = (ua: string): UaDetails => {
  return {
    browser: detectBrowser(ua),
    os: detectOs(ua),
    deviceType: detectDeviceType(ua)
  };
};
