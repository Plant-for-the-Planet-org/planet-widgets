import tenantConfig from './../tenant.json';
export default function getTenantConfig(tenantkey){
   const config =  tenantConfig.filter(tenant => tenant.id.toLowerCase() === tenantkey.toLowerCase());
   return config[0] || {
        "id": "ten_I9TW3ncG",
        "url": "https://www.trilliontreecampaign.org"
    };
}