import ChartUtils from '../utils/chartUtils.js';
import GridUtils from '../utils/gridUtils.js';
import SharedUtils from '../utils/sharedUtils.js';

/*$(document).ready(async () => {
    await ranking.initialize();
});*/

const ranking = {
    initialize: async function (){
        ChartUtils.ranking.topBrands.create(SharedUtils.data.registrationList, $('#topBrands'));
        ChartUtils.ranking.topModels.create(SharedUtils.data.registrationList, $('#topModels'));

        GridUtils.ranking.topResults.create(SharedUtils.data.registrationList, document.getElementById('topResults'));
    }
}

window.ranking = ranking;