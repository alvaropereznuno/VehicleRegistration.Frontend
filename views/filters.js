import { getBrands } from '../services/vehicleRegistrationService.js';

async function loadBrands(id, name){
    const cmbBrand = document.getElementById('cmbBrand');

    try {
        // Llamada a getBrands para obtener las marcas
        const brands = await getBrands(id, name);

        // Rellenar el combo con los datos obtenidos
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.id;
            option.textContent = brand.name;
            cmbBrand.appendChild(option);
        });
    } catch (error) {
        console.error('Error al rellenar el combo de marcas:', error);
    }
}