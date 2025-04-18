// Importar el modelo
import TypeModel from '../models/typesModel.js';
import BrandModel from '../models/brandModel.js';
import ModelModel from '../models/modelModel.js';
import ProvinceModel from '../models/provinceModel.js';
import DataModel from '../models/dataModel.js';
import PROVINCES from '../models/constants/provinces.js';

// const BASE_URL = 'https://localhost:7230/Vehicle';
const BASE_URL = 'https://vehicleregistrationsapirest-e0e5fjagbmc7hwfp.spaincentral-01.azurewebsites.net/Vehicle';


export async function getTypes(id, name){
    const data = [
        { id: 1, name: "Combustion" },
        { id: 2, name: "Híbrido" },
        { id: 3, name: "Híbrido Enchufable" },
        { id: 4, name: "100% Eléctrico" },
        { id: 5, name: "Hidrógeno" },
        { id: 99, name: "Otro" },
    ];

    return data
        .map(item => new TypeModel(item.id, item.name))
        .sort((a, b) => a.name.localeCompare(b.id));
}

// GetBrands
export async function getBrands(id, name) {
    const url = new URL(`${BASE_URL}/GetBrands`);
    url.searchParams.append('Id', id);
    url.searchParams.append('Name', name);

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();

        return data
            .map(item => new BrandModel(item.I, item.D))
            .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error al obtener las marcas:', error);
        throw error;
    }
}

// GetModels
export async function getModels(id, name, brandId) {
    const url = new URL(`${BASE_URL}/GetModels`);
    url.searchParams.append('Id', id);
    url.searchParams.append('Name', name);
    url.searchParams.append('BrandId', brandId);

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();

        return data
            .map(item => new ModelModel(item.I, item.D, item.R, item.XB))
            .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
        console.error('Error al obtener los modelos:', error);
        throw error;
    }
}

// GetProvinces
export async function getProvinces(id, name) {
    const data = PROVINCES;

    return data
        .map(item => new ProvinceModel(item.code, item.name))
        .sort((a, b) => a.name.localeCompare(b.name));

}

//GetData
export async function getData(registrationDateFrom, registrationDateTo, brandId, modelId, provinceCode, type) {
    const url = new URL(`${BASE_URL}/GetVehicles`);
    url.searchParams.append('RegistrationDateFrom', registrationDateFrom);
    url.searchParams.append('RegistrationDateTo', registrationDateTo);
    url.searchParams.append('BrandId', brandId);
    url.searchParams.append('ModelId', modelId);
    url.searchParams.append('ProvinceCode', provinceCode);
    url.searchParams.append('Type', type);

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();

        return data.map(item => new DataModel(item.D, item.B, '', item.M, '', item.P, '', item.T, '', item.C));
    } catch (error) {
        console.error('Error al obtener los datos de vehículos matriculados:', error);
        throw error;
    }
}

//CompleteData
export async function completeData(datas, brands, models, provinces, types){
    const brandMap = Object.fromEntries(brands.map(b => [b.id, b]));
    const modelMap = Object.fromEntries(models.map(m => [m.id, m]));
    const provinceMap = Object.fromEntries(provinces.map(p => [p.id, p]));
    const typeMap = Object.fromEntries(types.map(t => [t.id, t]));

    datas.forEach(d => {
        d.brandName = brandMap[d.brandId]?.name || "Desconocido";
        d.modelName = modelMap[d.modelId]?.name || "Desconocido";
        d.provinceName = provinceMap[d.provinceId]?.name || "Desconocido";
        d.typeName = typeMap[d.type]?.name || "Desconocido";
    });

    return datas;
}