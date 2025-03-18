import { getTypes, getBrands, getModels, getProvinces, getData, completeData } from "./services/vehicleRegistrationsService.js";
import { filterModels, filterData } from "./services/localVehicleRegistrationsService.js";
import DataModel from '../models/dataModel.js';

let typeList;
let brandList;
let modelList;
let provinceList;

let originalData;
let filteredData;

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
    select.innerHTML = '<option value="" selected>Marca ...</option>';

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

    // Get parameters
    typeList = await getTypes('', '');
    brandList = await getBrands('', '');
    modelList = await getModels('', '', '');
    provinceList = await getProvinces('', '');
    originalData = await getData('', '', '', '', '', '');
    originalData = await completeData(originalData, brandList, modelList, provinceList, typeList);

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
});

// Eventos
document.getElementById("cmbBrand").addEventListener("change", async (event) => {
    const brandId = event.target.value;

    await populateModels(modelList, brandId);
});

document.getElementById("btnFilter").addEventListener("click", async (event) => {
    event.preventDefault();

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
});