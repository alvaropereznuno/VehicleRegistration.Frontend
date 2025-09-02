import DICT from '../configurations/dict.js';
import VehiclesService from '../services/vehiclesService.js';
import { getIndexedData, setIndexedData } from '../utils/indexedUtils.js';

const SharedUtils = {
    data: {
        brandList: [],
        modelList: [],
        registrationList: [],
        registrationFilteredList: []
    },
    loadBrands: async function (force = false) {
        try {
            let data = await getIndexedData('brandList');

            if (force || data == null) {
                data = await VehiclesService.getBrands();
                setIndexedData('brandList', data);
            }
            
            this.data.brandList = data;
        } catch (error) {
            console.error("Error fetching brands:", error);
            return [];
        }
    },
    loadModels: async function (force = false) {
        try {
            let data = await getIndexedData('modelList');

            if (force || data == null) {
                data = await VehiclesService.getModels();
                setIndexedData('modelList', data);
            }
            
            this.data.modelList = data;
        } catch (error) {
            console.error("Error fetching models:", error);
            return [];
        }
    },
    loadRegistrations: async function (registrationDateFrom, registrationDateTo = null, force = false) {
        try {
            let data = await getIndexedData('registrationList');

            if (force || data == null) {
                data = await VehiclesService.getRegistrations(registrationDateFrom);
                setIndexedData('registrationList', data);
            }
            
            this.data.registrationList = data;
            this.data.registrationFilteredList = data;
        } catch (error) {
            console.error("Error fetching registrations:", error);
            return [];
        }
    },



    getModelDescription: function (modelId, withBrand = false) {
        const model = this.data.modelList.find(model => model.id == modelId);

        if (model != null && withBrand){
            const brandds = this.getBrandDescription(modelId);
            return model.description.toLowerCase().includes(brandds.toLowerCase()) ? model.description : `${brandds} ${model.description}`;
        }

        return model ? model.description : null;
    },
    getBrandId: function (modelId) {
        const model = this.data.modelList.find(model => model.id == modelId);
        const brand = this.data.brandList.find(brand => brand.id == model.brandId);
        return brand ? brand.id : null;
    },
    getBrandDescription: function (modelId) {
        const model = this.data.modelList.find(model => model.id == modelId);
        const brand = this.data.brandList.find(brand => brand.id == model.brandId);
        return brand ? brand.description : null;
    },
    getBrandDescription2: function (brandId) {
        const brand = this.data.brandList.find(brand => brand.id == brandId);
        return brand ? brand.description : null;
    },
    getProvinceDescription: function (provinceId) {
        const province = DICT.PROVINCES.find(province => province.id == provinceId);
        return province ? province.description : null;
    },
    getCommunityDescription: function (provinceId) {
        const province = DICT.PROVINCES.find(province => province.id == provinceId);
        const community = DICT.COMMUNITIES.find(community => community.id == province.communityId);
        return community ? community.description : null;
    },
    getMotorTypeDescription: function (motorTypeId) {
        const motorType = DICT.MOTOR_TYPES.find(motorType => motorType.id == motorTypeId);
        return motorType ? motorType.description : null;
    },
    getServiceTypeDescription: function (serviceTypeId) {
        const serviceType = DICT.SERVICE_TYPES.find(serviceType => serviceType.id == serviceTypeId);
        return serviceType ? serviceType.description : null;
    },

    filterRegistrations: function (registrationDateFrom = null, registrationDateTo = null, brandIdList = null, modelIdList = null, motorTypeIdList = null, serviceTypeIdList = null, provinceIdList = null) {
        this.data.registrationFilteredList = this.data.registrationList.filter(registration => {
            return (
                (isNaN(registrationDateFrom) || registrationDateFrom === null || new Date(registration.registrationDate) >= registrationDateFrom) &&
                (isNaN(registrationDateTo) || registrationDateTo === null || new Date(registration.registrationDate) <= registrationDateTo) &&
                (modelIdList.length === 0 || modelIdList.includes(registration.modelId)) &&
                (motorTypeIdList.length === 0 || motorTypeIdList.includes(registration.motorTypeId)) &&
                (serviceTypeIdList.length === 0 || serviceTypeIdList.includes(registration.serviceTypeId)) &&
                (provinceIdList.length === 0 || provinceIdList.includes(registration.provinceId))
            );
        });

        const event = new CustomEvent("globalDataUpdated");
        window.dispatchEvent(event);
    },
    filterBrands: function (registrationList, modelList) {
        return [...new Set(
            registrationList
                .map(registration => 
                    modelList.find(model => model.id === registration.modelId)?.brandId
                )
                .filter(brandId => brandId !== undefined)
        )];
    },
    filterModels: function (registrationList) {
        return [...new Set(
            registrationList.map(registration => registration.modelId)
        )];
    }
}

export default SharedUtils;