import tenantConfig from './../tenant.json';
export default function getTenantConfig(tenantkey){
   const config =  tenantConfig.filter(tenant => tenant.id.toLowerCase() === tenantkey.toLowerCase());
   return config[0] || {
        "id": "ten_NxJq55pm",
        "url": "https://web.plant-for-the-planet.org"
    };
}