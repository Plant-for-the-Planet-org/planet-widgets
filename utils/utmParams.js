/**
 * Gets UTM parameters from widget attributes or page URL
 * Widget attributes take priority over page URL parameters
 * 
 * @param {string} widgetUtmCampaign - utm_campaign from widget attribute
 * @param {string} widgetUtmId - utm_id from widget attribute
 * @returns {string} URL query string with UTM parameters (e.g., "&utm_campaign=xyz&utm_id=123")
 */
export function getUtmParams(widgetUtmCampaign, widgetUtmId) {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Widget attributes override page URL parameters
  const utmCampaign = widgetUtmCampaign || urlParams.get('utm_campaign');
  const utmId = widgetUtmId || urlParams.get('utm_id');
  
  let utmString = '';
  
  if (utmCampaign) {
    utmString += `&utm_campaign=${encodeURIComponent(utmCampaign)}`;
  }
  
  if (utmId) {
    utmString += `&utm_id=${encodeURIComponent(utmId)}`;
  }
  
  return utmString;
}
