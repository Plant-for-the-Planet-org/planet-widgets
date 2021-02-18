import tenantConfig from './../tenant.json';
export default function getTenantConfig(tenantkey){
   const config =  tenantConfig.filter(tenant => tenant.id === tenantkey);
   console.log('config',config);
   return config[0];
}