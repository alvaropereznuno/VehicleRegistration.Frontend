import ChartUtils from './utils/chartUtils.js';
import GridUtils from './utils/gridUtils.js';
import SharedUtils from './utils/sharedUtils.js';

/*$(document).ready(async () => {
    await ranking.initialize();
});*/

const ranking = {
    initialize: async function (){
        await Promise.all([
            ChartUtils.ranking.topBrands.create(SharedUtils.data.registrationFilteredList, $('#topBrands')),
            ChartUtils.ranking.topModels.create(SharedUtils.data.registrationFilteredList, $('#topModels')),
            ChartUtils.ranking.topBrandsAcc.create(SharedUtils.data.registrationFilteredList, $('#topBrandsAcc')),
            ChartUtils.ranking.topModelsAcc.create(SharedUtils.data.registrationFilteredList, $('#topModelsAcc')),

            GridUtils.ranking.topResults.create(SharedUtils.data.registrationFilteredList, document.getElementById('topResults'))
        ]);
        
        window.addEventListener("globalDataUpdated", async () => {
            await Promise.all([
                ChartUtils.ranking.topBrands.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.ranking.topModels.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.ranking.topBrandsAcc.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.ranking.topModelsAcc.update(SharedUtils.data.registrationFilteredList),
        
                GridUtils.ranking.topResults.update(SharedUtils.data.registrationFilteredList)
            ]);
        });
    }
}

window.ranking = ranking;