import SharedUtils from './sharedUtils.js';

const GtagUtils = {
    isConsent: function() {
        if (typeof gtag === 'function') {
            return true;
        } else {
            // console.log("Consentimiento de trazas no concedido");
            return false;
        }
    },
    selectedTab: async function (title) {
        if (this.isConsent()){
            gtag('event', 'page_view', {
                event_category: 'Pestaña',
                event_label: 'Selección de pestaña',
                page_title: title
            });
        }
    },
    selectedFilter: function(filters) {
        if (this.isConsent()){
            const safeMap = (list, fn) => (Array.isArray(list) ? list.slice(0, 5).map(fn).join(',') : '');

            gtag('event', 'apply_filters', {
                event_category: 'Filtros',
                event_label: 'Filtros de Usuario',

                filter_models: safeMap(filters.modelIdList, id => SharedUtils.getModelDescription(id)),
                filter_brands: safeMap(filters.brandIdList, id => SharedUtils.getBrandDescription2(id)),
                filter_motorTypes: safeMap(filters.motorTypeIdList, id => SharedUtils.getMotorTypeDescription(id)),
                filter_serviceTypes: safeMap(filters.serviceTypeIdList, id => SharedUtils.getServiceTypeDescription(id)),
                filter_communities: safeMap(filters.communityIdList, id => SharedUtils.getCommunityDescription(id)),
                filter_provinces: safeMap(filters.provinceIdList, id => SharedUtils.getProvinceDescription(id))
            });
        }
    },
    selectedRrss: function(platform) {
        if (this.isConsent()){
            gtag('event', 'click_rrss', {
                event_category: 'RRSS',
                event_label: platform
            });
        }
    }
}
export default GtagUtils;