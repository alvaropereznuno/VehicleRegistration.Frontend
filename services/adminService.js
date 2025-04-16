// adminService.js

// Importar el modelo
import CONFIG from '../configurations/config.js';

const AdminService = {
    Url: CONFIG.BaseUrl + CONFIG.AdminService.Controller,

    ProcessFile: async function (file) {
        const url = new URL(`${AdminService.Url}/ProcessFile`);
        const formData = new FormData();
        formData.append('file', file);

        return fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                };
            });
    },

    ProcessImportRegistrations: async function () {
        const url = new URL(`${AdminService.Url}/ProcessImportRegistrations`);

        return fetch(url, {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                };
            });
    },

    ProcessRefreshSynonymsPreprocessed: async function () {
        const url = new URL(`${AdminService.Url}/ProcessRefreshSynonymsPreprocessed`);

        return fetch(url, {
                method: 'POST'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                };
            });
    },

    SetSynonymsBrandsToBrand: async function (brandFatherId, brandsSynonyms) {
        const url = new URL(`${AdminService.Url}/SetSynonymsBrandsToBrand`);
        const formData = new FormData();
        formData.append('brandFatherId', brandFatherId);
        formData.append('brandsSynonyms', brandsSynonyms);

        return fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                };
            });
    },

    SetSynonymsModelsToModel: async function (modelFatherId, modelsSynonyms) {
        const url = new URL(`${AdminService.Url}/SetSynonymsModelsToModel`);
        const formData = new FormData();
        formData.append('modelFatherId', modelFatherId);
        formData.append('modelsSynonyms', modelsSynonyms);

        return fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                };
            });
    },

    SetSynonymsModelsToBrand: async function (brandFatherId, modelsSynonyms) {
        const url = new URL(`${AdminService.Url}/SetSynonymsModelsToBrand`);
        const formData = new FormData();
        formData.append('brandFatherId', brandFatherId);
        formData.append('modelsSynonyms', modelsSynonyms);

        return fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                };
            });
    }
};

export default AdminService;