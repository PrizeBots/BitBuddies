
export function getSystemInfo() {
  // console.log("in_root --> ", window.navigator)
  const details = window.navigator.userAgent;
      
  /* Creating a regular expression
  containing some mobile devices keywords
  to search it in details string*/
  const regexp = /android|iphone|kindle|ipad/i;
  
  /* Using test() method to search regexp in details
  it returns boolean value*/
  const isMobileDevice = regexp.test(details);
  // console.log("in_root --> ", isMobileDevice)
  return isMobileDevice;
}