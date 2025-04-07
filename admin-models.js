import { saveRegistrations, setModelSynonyms, setOptimization } from "./services/vehicleRegistrationsRService.js";
import { synonyms } from "./services/registrationServices.js";
import { getBrands } from "./services/vehicleRegistrationsService.js";
import ModelSynonymsModel from "./models/modelSynonymsModel.js";

let tbSynonyms;
let brands;

document.addEventListener("DOMContentLoaded", async () => {
    brands = await getBrands('', '', '');

    tbSynonyms = new gridjs.Grid({ 
        columns: ['Id', 'Modelo', 'Marca (Id)'],
        data: [],
        pagination: true
      }).render(document.getElementById('tbSynonyms'));

    // Oculta el velo de carga
    loadingScreen.style.display = "none";
});

document.getElementById("btnSearch").addEventListener("click", async (event) => {
    const model = document.getElementById("txtModel").value;
    
    const models = await synonyms.searchModels(model);

    tbSynonyms.updateConfig({
        data: models.map(m => [m.id, m.name, brands.find(b => m.relae b.id === m.brandId).name + ' (' + m.brandId + ')']),
    }).forceRender();
});

document.getElementById("btnLoad").addEventListener("click", async (event) => {
    const fileInput = document.getElementById('frmFileLoad');
    const file = fileInput.files[0];

    if (file) {
        // Muestra el velo de carga
        const loadingScreen = document.getElementById("loadingScreen");
        loadingScreen.style.display = "flex";
        
        await saveRegistrations(file);

        document.getElementById('frmFileLoad').value = '';

        // Oculta el velo de carga
        loadingScreen.style.display = "none";
    } else {
        console.log('No se ha seleccionado ningún archivo.');
    }
});

document.getElementById("btnOptimize").addEventListener("click", async (event) => {

    // Muestra el velo de carga
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.display = "flex";
    
    await setOptimization();

    document.getElementById('frmFileLoad').value = '';

    // Oculta el velo de carga
    loadingScreen.style.display = "none";
});

document.getElementById('frmFileLoad').addEventListener('change', function () {
    btnLoad.disabled = !document.getElementById('frmFileLoad').files.length;
});

document.getElementById('txtModel').addEventListener('change', function () {
    btnSearch.disabled = txtModel.value.trim() === ''
});

document.getElementById('txtFather').addEventListener('change', function () {
    btnSynonymsSave.disabled = txtFather.value.trim() === '' || txtSynonyms.value.trim() === ''
});

document.getElementById('txtSynonyms').addEventListener('change', function () {
    btnSynonymsSave.disabled = txtFather.value.trim() === '' || txtSynonyms.value.trim() === ''
});

document.getElementById("btnSynonymsSave").addEventListener("click", async (event) => {
    const father = parseInt(document.getElementById("txtFather").value);
    const synonyms = document.getElementById("txtSynonyms").value;
    const idSynonymsList = synonyms.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));

    let modelSynonyms = new ModelSynonymsModel(father, idSynonymsList);

    // Muestra el velo de carga
    const loadingScreen = document.getElementById("loadingScreen");
    loadingScreen.style.display = "flex";
    
    await setModelSynonyms(modelSynonyms);

    document.getElementById('frmFileLoad').value = '';

    document.getElementById("txtFather").value = '';
    document.getElementById("txtSynonyms").value = '';
    btnSynonymsSave.disabled = true;

    // Oculta el velo de carga
    loadingScreen.style.display = "none";
});