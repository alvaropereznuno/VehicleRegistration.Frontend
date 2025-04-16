import ChartUtils from '../utils/chartUtils.js';
import GridUtils from '../utils/gridUtils.js';
import SharedUtils from '../utils/sharedUtils.js';

/*$(document).ready(async () => {
    await ranking.initialize();
});*/

const ranking = {
    initialize: async function (){

        // Get OriginalData
        await Promise.all([
            SharedUtils.loadModels(),
            SharedUtils.loadBrands(),
            SharedUtils.loadRegistrations('2020-01-01')
        ]);

        ChartUtils.ranking.topBrands.create(SharedUtils.data.registrationList, $('#topBrands'));
        ChartUtils.ranking.topModels.create(SharedUtils.data.registrationList, $('#topModels'));

        const topResultsContainer = document.getElementById('topResults');
        if (topResultsContainer) {
            GridUtils.ranking.topResults.create(SharedUtils.data.registrationList, topResultsContainer);
        } else {
            console.error("El contenedor 'topResults' no existe en el DOM.");
        }
    }
}

window.ranking = ranking;