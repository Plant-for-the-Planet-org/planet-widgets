import tenantConfig from './../tenant.json';
export default function getTenantConfig(tenantkey){
    switch(tenantkey){
        case 'ten_I9TW3ncG': return tenantConfig.planet;
        case 'ten_3hEjJCBs': return tenantConfig.salesforce;
        default: return planet;
    }
}