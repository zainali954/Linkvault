import { UAParser } from "ua-parser-js";


export const getDeviceInfo = (userAgentString) => {
  const parser = new UAParser(userAgentString);
  const browser = parser.getBrowser();  // { name: 'Chrome', version: '135.0.0.0' }
  const os = parser.getOS();            // { name: 'Windows', version: '10' }

  return {
    browserName: browser.name || "Unknown Browser",
    browserVersion: browser.version?.split(".")[0] || "",
    osName: os.name || "Unknown OS",
    osVersion: os.version || "",
  };
};
