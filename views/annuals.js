import ChartUtils from '../utils/chartUtils.js';
import GridUtils from '../utils/gridUtils.js';
import SharedUtils from '../utils/sharedUtils.js';

/*$(document).ready(async () => {
    await ranking.initialize();
});*/

const annuals = {
    initialize: async function (){
        await Promise.all([
            SharedUtils.loadModels(),
            SharedUtils.loadBrands(),
            SharedUtils.loadRegistrations('2020-01-01')
        ]);

        ChartUtils.ranking.topBrands.create(SharedUtils.data.registrationList, $('#topBrands2'));
        ChartUtils.ranking.topModels.create(SharedUtils.data.registrationList, $('#topModels2'));

        const topResultsContainer = document.getElementById('topResults2');
        if (topResultsContainer) {
            GridUtils.ranking.topResults.create(SharedUtils.data.registrationList, topResultsContainer);
        } else {
            console.error("El contenedor 'topResults2' no existe en el DOM.");
        }
    }
}

window.annuals = annuals;