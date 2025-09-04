// adminService.js

// Importar el modelo
import CONFIG from '../configurations/config.js';
import VersionModel from '../models/versionModel.js';

const UsersService = {
    Url: CONFIG.BaseUrl + CONFIG.UsersService.Controller,

    getLastVersion: async function () {
        const url = new URL(`${UsersService.Url}/GetLastVersion`);

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => new VersionModel(data.G, data.D));
    }
};

export default UsersService;