import ChartUtils from './utils/chartUtils.js';
import GridUtils from './utils/gridUtils.js';
import SharedUtils from './utils/sharedUtils.js';

const propulsion = {
    start: function(){
        $(".loadingTarjet").show();
        $(".loadedTarjet").hide();
    },
    initialize: async function (){
        await Promise.all([
            ChartUtils.propulsion.motorTypesAcc.create(SharedUtils.data.registrationFilteredList, $('#motorTypesAcc')),
            ChartUtils.propulsion.motorTypes100.create(SharedUtils.data.registrationFilteredList, $('#motorTypes100')),
            ChartUtils.propulsion.motorTypesAnnualDiff.create(SharedUtils.data.registrationFilteredList, $('#motorTypesAnnualDiff')),
            ChartUtils.propulsion.motorTypesAnnualDiff100.create(SharedUtils.data.registrationFilteredList, $('#motorTypesAnnualDiff100'))
        ]);

        $(".loadingTarjet").hide();
        $(".loadedTarjet").show();
        
        // GridUtils.ranking.topResults.create(SharedUtils.data.registrationFilteredList, document.getElementById('topResults'));

        window.addEventListener("globalDataUpdated", async () => {
            await Promise.all([
                ChartUtils.propulsion.motorTypesAcc.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.propulsion.motorTypes100.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.propulsion.motorTypesAnnualDiff.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.propulsion.motorTypesAnnualDiff100.update(SharedUtils.data.registrationFilteredList100)
            ]);
             
             // GridUtils.ranking.topResults.update(SharedUtils.data.registrationFilteredList);
         });
    }
}

window.propulsion = propulsion;