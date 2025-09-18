import ChartUtils from './utils/chartUtils.js';
import GridUtils from './utils/gridUtils.js';
import SharedUtils from './utils/sharedUtils.js';

/*$(document).ready(async () => {
    await ranking.initialize();
});*/

const annuals = {
    start: function(){
        $(".loadingTarjet").show();
        $(".loadedTarjet").hide();
    },
    initialize: async function (){
        await Promise.all([
            ChartUtils.annuals.annualSellings.create(SharedUtils.data.registrationFilteredList, $('#annuals')),
            ChartUtils.annuals.annualSellingsDiff.create(SharedUtils.data.registrationFilteredList, $('#annualsdiff')),
            ChartUtils.annuals.annualSellingsAcc.create(SharedUtils.data.registrationFilteredList, $('#annualsacc')),
            ChartUtils.annuals.annualSellingsAccDiff.create(SharedUtils.data.registrationFilteredList, $('#annualsaccdiff')),
            
            GridUtils.annuals.annualSellings.create(SharedUtils.data.registrationFilteredList, document.getElementById('annualsResults'))
        ]);

        $(".loadingTarjet").hide();
        $(".loadedTarjet").show();

        window.addEventListener("globalDataUpdated", async () => {
            await Promise.all([
                ChartUtils.annuals.annualSellings.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.annuals.annualSellingsDiff.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.annuals.annualSellingsAcc.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.annuals.annualSellingsAccDiff.update(SharedUtils.data.registrationFilteredList),
                
                GridUtils.annuals.annualSellings.update(SharedUtils.data.registrationFilteredList)
            ]);
        });
    }
}

window.annuals = annuals;