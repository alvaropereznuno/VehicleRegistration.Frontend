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
        } catch (error) {
            console.error("Error fetching registrations:", error);
            return [];
        }
    },
    getModelDescription: function (modelId) {
        const model = this.data.modelList.find(model => model.id == modelId);
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
    getVehicleTypeDescription: function (vehicleTypeId) {
        const vehicleType = DICT.VEHICLE_TYPES.find(vehicleType => vehicleType.id == vehicleTypeId);
        return vehicleType ? vehicleType.description : null;
    },
    filterRegistrations: function (registrationList, registrationDateFrom = null, registrationDateTo = null, brandIdList = null, modelIdList = null, motorTypeIdList = null, vehicleTypeIdList = null, provinceIdList = null) {
        let filteredModelIds = modelIdList || [];
        if (brandIdList) {
            filteredModelIds = modelList
                .filter(model => brandIdList.includes(model.brandId))
                .map(model => model.id);
        }

        return registrationList.filter(registration => {
            return (
                (registrationDateFrom === null || registration.registrationDate >= registrationDateFrom) &&
                (registrationDateTo === null || registration.registrationDate <= registrationDateTo) &&
                (filteredModelIds.length === 0 || filteredModelIds.includes(registration.modelId)) &&
                (motorTypeIdList === null || motorTypeIdList.includes(registration.motorTypeId)) &&
                (vehicleTypeIdList === null || vehicleTypeIdList.includes(registration.vehicleTypeId)) &&
                (provinceIdList === null || provinceIdList.includes(registration.provinceId))
            );
        });
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