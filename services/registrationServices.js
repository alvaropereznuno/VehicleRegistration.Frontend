import { getBrands, getModels } from "./vehicleRegistrationsService.js";
import BrandModel from '../models/brandModel.js';
import ModelModel from '../models/modelModel.js';

export const synonyms = {
    chart: null,
    search: async (model) => {
        const modelList = await getModels('', model, '');

        return modelList;
    }
}