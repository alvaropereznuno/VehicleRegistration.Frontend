import { getTypes, getBrands, getModels, getProvinces, getData, completeData } from "./services/vehicleRegistrationsService.js";
import { filterModels, filterData } from "./services/localVehicleRegistrationsService.js";
import { vehiclesSoldType, vehiclesSoldStackedType, vehiclesTypes, vehiclesBrands, vehiclesModels } from "./services/dashboardServices.js";
import { getIndexedData, setIndexedData } from './services/indexedServices.js';
import DataModel from '../models/dataModel.js';

let typeList;
let brandList;
let modelList;
let provinceList;

let originalData;
let filteredData;

let vehiclesSoldType_Chart;

async function populateTypes(list){
    const select = document.getElementById("cmbType");

    list.forEach(r => {
        const option = document.createElement("option");
        option.value = r.id;
        option.textContent = r.name;
        select.appendChild(option);
    });
}

async function populateBrands(list){
    const select = document.getElementById("cmbBrand");

    list.forEach(r => {
        const option = document.createElement('option');
        option.value = r.id;
        option.textContent = r.name;
        select.appendChild(option);
    });
}

async function populateModels(list, brandId) {
    const select = document.getElementById("cmbModel");
    
    // Limpia el contenido del select antes de agregar nuevas opciones
    select.innerHTML = '<option value="" selected>Modelo ...</option>';

    // Filtra la lista con los modelos correspondientes
    const result = await filterModels(list, brandId);

    // Agrega las nuevas opciones
    result.forEach(r => {
        const option = document.createElement('option');
        option.value = r.id;
        option.textContent = r.name;
        select.appendChild(option);
    });
}

async function populateProvinces(list){
    const select = document.getElementById("cmbProvince");

    list.forEach(r => {
        const option = document.createElement('option');
        option.value = r.id;
        option.textContent = r.name;
        select.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", async () => {

    // Muestra el velo de carga
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.display = "flex";

    // Realizar peticiones al servidor
    const typeList = await getTypes('', '');
    const brandList = await getBrands('', '');
    const modelList = await getModels('', '', '');
    const provinceList = await getProvinces('', '');

    // Get OriginalData
    let originalData = await getIndexedData();

    if (!originalData) {
        console.log('Datos no encontrados en IndexedDB, realizando las peticiones...');
        
        originalData = await getData('', '', '', '', '', '');
        originalData = await completeData(originalData, brandList, modelList, provinceList, typeList);

        // Guardar en IndexedDB para futuras consultas
        await setIndexedData(originalData);
        console.log('Datos almacenados en IndexedDB.');
    } else {
        console.log('Datos obtenidos desde IndexedDB.');
    }

    await populateTypes(typeList);
    await populateBrands(brandList);
    await populateProvinces(provinceList);

    filteredData = originalData.map(data => 
        new DataModel(
            data.date,
            data.brandId,
            data.brandName,
            data.modelId,
            data.modelName,
            data.provinceId,
            data.provinceName,
            data.type,
            data.typeName,
            data.count
        )
    );

    vehiclesSoldType.create(filteredData, document.getElementById('vehiclesSoldType'));
    vehiclesSoldStackedType.create(filteredData, document.getElementById('vehiclesSoldStackedType'));
    vehiclesTypes.create(filteredData, document.getElementById('vehiclesTypes'));
    vehiclesBrands.create(filteredData, document.getElementById('vehiclesBrands'));
    vehiclesModels.create(filteredData, document.getElementById('vehiclesModels'));

    // Oculta el velo de carga
    loadingScreen.style.display = "none";
});

// Eventos
document.getElementById("startDate").addEventListener("change", async (event) => {
    await updateFilters();
});
document.getElementById("endDate").addEventListener("endDate", async (event) => {
    await updateFilters();
});
document.getElementById("cmbType").addEventListener("change", async (event) => {
    await updateFilters();
});
document.getElementById("cmbBrand").addEventListener("change", async (event) => {
    const brandId = event.target.value;

    await populateModels(modelList, brandId);
    await updateFilters();
});
document.getElementById("cmbModel").addEventListener("change", async (event) => {
    await updateFilters();
});
document.getElementById("cmbProvince").addEventListener("change", async (event) => {
    await updateFilters();
});

async function updateFilters(){
    // Obtén los valores seleccionados de los combos
    let startDate = document.getElementById("startDate").value;
    let endDate = document.getElementById("endDate").value;
    if (startDate) startDate += '-01';
    if (endDate) endDate += '-01';

    const type = document.getElementById("cmbType").value;
    const brandId = document.getElementById("cmbBrand").value;
    const modelId = document.getElementById("cmbModel").value;
    const provinceId = document.getElementById("cmbProvince").value;

    filteredData = await filterData(originalData, startDate, endDate, brandId, modelId, provinceId, type);
    
    vehiclesSoldType.update(filteredData);
    vehiclesSoldStackedType.update(filteredData);
    vehiclesTypes.update(filteredData);
    vehiclesBrands.update(filteredData);
    vehiclesModels.update(filteredData);
}