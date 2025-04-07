import { getBrands, getModels } from "./vehicleRegistrationsService.js";

export const synonyms = {
    chart: null,
    searchModels: async (model) => {
        const modelList = await getModels('', model, '');

        return modelList;
    },
    searchBrands: async (brand) => {
        const brandList = await getBrands('', brand, '');

        return brandList;
    }
}