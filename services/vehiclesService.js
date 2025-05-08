// vehiclesService.js

// Importar el modelo
import CONFIG from '../configurations/config.js';
import BrandModel from '../models/brandModel.js';
import ModelModel from '../models/modelModel.js';
import RegistrationModel from '../models/registrationModel.js';

const VehiclesService = {
    url: CONFIG.BaseUrl + CONFIG.VehiclesService.Controller,

    getBrands: async function (id = null, description = null) {
        const url = new URL(`${VehiclesService.url}/GetBrands`);
        if (id != null) url.searchParams.append('Id', id);
        if (description != null) url.searchParams.append('Description', description);

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => data.map(item => new BrandModel(item.I, item.D)));
    },

    getModels: async function (id = null, description = null, brandId = null) {
        const url = new URL(`${VehiclesService.url}/GetModels`);
        if (id != null) url.searchParams.append('Id', id);
        if (description != null) url.searchParams.append('Description', description);
        if (brandId != null) url.searchParams.append('BrandId', brandId);

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => data.map(item => new ModelModel(item.I, item.D, item.R)));
    },

    getRegistrations: async function (registrationDateFrom, registrationDateTo = null, brandIdList = null, modelIdList = null, provinceId = null, communityId = null, motorTypeId = null, serviceTypeId = null)
    {
        const url = new URL(`${VehiclesService.url}/GetRegistrations`);
        url.searchParams.append('RegistrationDateFrom', registrationDateFrom);
        if (registrationDateTo != null) url.searchParams.append('RegistrationDateTo', registrationDateTo);
        if (brandIdList != null) url.searchParams.append('BrandIdList', brandIdList);
        if (modelIdList != null) url.searchParams.append('ModelIdList', modelIdList);
        if (provinceId != null) url.searchParams.append('ProvinceId', provinceId);
        if (communityId != null) url.searchParams.append('CommunityId', communityId);
        if (motorTypeId != null) url.searchParams.append('MotorTypeId', motorTypeId);
        if (serviceTypeId != null) url.searchParams.append('ServiceTypeId', serviceTypeId);

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => data.map(item => new RegistrationModel(item.M, item.TM, item.TS, item.PR, item.DT, item.C)));
    }
};

export default VehiclesService;