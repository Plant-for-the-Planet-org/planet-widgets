export default function getTenantConfig(tenantName){
    const config = 
        {
            planet:{
                tenantURL: "https://www1.plant-for-the-planet.org",
                tenantPoweredByURL: "https://a.plant-for-the-planet.org/",
                tenantName: "Plant-for-the-Planet",
                tenantLogoURL:"https://cdn.plant-for-the-planet.org/logo/svg/planet.svg",
                tenantDarkLogoURL: "https://cdn.plant-for-the-planet.org/logo/svg/planetDark.svg"
            },

            salesforce:{
                tenantURL: "https://trees.salesforce.com",
                tenantPoweredByURL: "https://salesforce.com/",
                tenantName: "Salesforce",
                tenantLogoURL:"https://cdn.plant-for-the-planet.org/logo/svg/salesforce.svg",
                tenantDarkLogoURL: "https://cdn.plant-for-the-planet.org/logo/svg/salesforce.svg"
            }
        }
    switch(tenantName){
        case 'planet': return config.planet;
        case 'salesforce': return config.salesforce;
        default: return planet;
    }
}