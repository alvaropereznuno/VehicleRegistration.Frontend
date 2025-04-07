import { saveRegistrations, setOptimization } from "./services/vehicleRegistrationsRService.js";
import { synonyms } from "./services/registrationServices.js";
import { getBrands } from "./services/vehicleRegistrationsService.js";

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
    
    const models = await synonyms.search(model);

    tbSynonyms.updateConfig({
        data: models.map(m => [m.id, m.name, brands.find(b => b.id === m.brandId).name + ' (' + m.brandId + ')']),
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