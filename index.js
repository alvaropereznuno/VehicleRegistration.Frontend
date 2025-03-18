import { getTypes, getBrands, getModels, getProvinces, getData } from "./services/vehicleRegistrationsService.js";

let types;
let brandList;
let modelList;
let provinceList;

let originalData;
let filteredData;

async function populateTypes(){
    const result = await getTypes();
    const select = document.getElementById("cmbType");

    // Limpia las opciones previas del combo, excepto la predeterminada
    select.innerHTML = '<option value="">Tipo ...</option>';

    result.forEach(r => {
        const option = document.createElement("option");
        option.value = r.id;
        option.textContent = r.name;
        select.appendChild(option);
    });
}

async function populateBrands(id, name){
    const select = document.getElementById("cmbBrand");

    try {
        // Llamada a getBrands para obtener las marcas
        const result = await getBrands(id, name);

        // Rellenar el combo con los datos obtenidos
        result.forEach(r => {
            const option = document.createElement('option');
            option.value = r.id;
            option.textContent = r.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al rellenar el combo de marcas:', error);
    }
}

async function populateModels(id, name, brandId){
    const select = document.getElementById("cmbModel");

    select.innerHTML = '<option value="">Modelo ...</option>';

    try {
        // Llamada a getBrands para obtener las marcas
        const result = await getModels(id, name, brandId);

        // Rellenar el combo con los datos obtenidos
        result.forEach(r => {
            const option = document.createElement('option');
            option.value = r.id;
            option.textContent = r.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al rellenar el combo de modelos:', error);
    }
}

async function populateProvinces(id, name){
    const select = document.getElementById("cmbProvince");

    try {
        // Llamada a getBrands para obtener las marcas
        const result = await getProvinces(id, name);

        // Rellenar el combo con los datos obtenidos
        result.forEach(r => {
            const option = document.createElement('option');
            option.value = r.id;
            option.textContent = r.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al rellenar el combo de provincias:', error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await populateTypes();
    await populateBrands('', '');
    await populateProvinces('', '');

    originalData = await getData('', '', '', '', '', '');
});

// Eventos
document.getElementById("cmbBrand").addEventListener("change", async (event) => {
    const brandId = event.target.value;
    await populateModels('', '', brandId);

});

document.getElementById("btnFilter").addEventListener("click", async (event) => {
    event.preventDefault();

    // Obtén los valores seleccionados de los combos
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    const type = document.getElementById("cmbType").value;
    const brandId = document.getElementById("cmbBrand").value;
    const modelId = document.getElementById("cmbModel").value;
    const provinceId = document.getElementById("cmbProvince").value;

    await getData(startDate + '-01', startDate + '-01', brandId, modelId, provinceId, type);
});