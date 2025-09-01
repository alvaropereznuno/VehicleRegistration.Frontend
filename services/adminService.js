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
    }
};

export default AdminService;