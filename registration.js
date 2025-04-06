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
});

document.getElementById("btnSearch").addEventListener("click", async (event) => {
    const model = document.getElementById("txtModel").value;
    
    const models = await synonyms.search(model);

    tbSynonyms.updateConfig({
        data: models.map(m => [m.id, m.name, brands.find(b => b.id === m.brandId).name + ' (' + m.brandId + ')']),
    }).forceRender();
});