/**
 * Gets UTM parameters from widget attributes or page URL
 * Widget attributes take priority over page URL parameters
 *
 * @param {string} widgetUtmCampaign - utm_campaign from widget attribute
 * @param {string} widgetUtmId - utm_id from widget attribute
 * @param {string} separator - Separator to prepend to params (default: '&')
 * @returns {string} URL query string with UTM parameters (e.g., "&utm_campaign=xyz&utm_id=123") or empty string if no params
 */
export function getUtmParams(widgetUtmCampaign, widgetUtmId, separator = '&') {
	const urlParams = new URLSearchParams(window.location.search);
	const params = new URLSearchParams();

	// Widget attributes override page URL parameters
	const utmCampaign = widgetUtmCampaign || urlParams.get('utm_campaign');
	const utmId = widgetUtmId || urlParams.get('utm_id');

	if (utmCampaign) params.set('utm_campaign', utmCampaign);
	if (utmId) params.set('utm_id', utmId);

	const paramString = params.toString();
	return paramString ? `${separator}${paramString}` : '';
}
