import DICT from '../configurations/dict.js';
import VehiclesService from '../services/vehiclesService.js';
import { getIndexedData, setIndexedData } from '../utils/indexedUtils.js';

const SharedUtils = {
    data: {
        brandList: [],
        modelList: [],
        registrationList: [],
    },
    loadBrands: async function () {
        try {
            let data = await getIndexedData('brandList');

            if (data != null) {
                console.log("Recuperación de brandList desde IndexedDB.");
            } else {
                console.log("Recuperación de brandList desde Servicio.");
                data = await VehiclesService.getBrands();
                setIndexedData('brandList', data);
            }
            
            this.data.brandList = data;
        } catch (error) {
            console.error("Error fetching brands:", error);
            return [];
        }
    },
    loadModels: async function () {
        try {
            let data = await getIndexedData('modelList');

            if (data != null) {
                console.log("Recuperación de modelList desde IndexedDB.");
            } else {
                console.log("Recuperación de modelList desde Servicio.");
                data = await VehiclesService.getModels();
                setIndexedData('modelList', data);
            }
            
            this.data.modelList = data;
        } catch (error) {
            console.error("Error fetching models:", error);
            return [];
        }
    },
    loadRegistrations: async function (registrationDateFrom, registrationDateTo = null) {
        try {
            let data = await getIndexedData('registrationList');

            if (data != null) {
                console.log("Recuperación de registrationList desde IndexedDB.");
            } else {
                console.log("Recuperación de registrationList desde Servicio.");
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
    }
}

export default SharedUtils;