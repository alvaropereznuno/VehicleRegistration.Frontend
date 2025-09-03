import ChartUtils from './utils/chartUtils.js';
import GridUtils from './utils/gridUtils.js';
import SharedUtils from './utils/sharedUtils.js';

const propulsion = {
    initialize: async function (){
        ChartUtils.propulsion.motorTypesAcc.create(SharedUtils.data.registrationFilteredList, $('#motorTypesAcc'));
        ChartUtils.propulsion.motorTypes100.create(SharedUtils.data.registrationFilteredList, $('#motorTypes100'));
        ChartUtils.propulsion.motorTypesAnnualDiff.create(SharedUtils.data.registrationFilteredList, $('#motorTypesAnnualDiff'));
        ChartUtils.propulsion.motorTypesAnnualDiff100.create(SharedUtils.data.registrationFilteredList, $('#motorTypesAnnualDiff100'));

        // GridUtils.ranking.topResults.create(SharedUtils.data.registrationFilteredList, document.getElementById('topResults'));

        window.addEventListener("globalDataUpdated", () => {
             ChartUtils.propulsion.motorTypesAcc.update(SharedUtils.data.registrationFilteredList);
             ChartUtils.propulsion.motorTypes100.update(SharedUtils.data.registrationFilteredList);
             ChartUtils.propulsion.motorTypesAnnualDiff.update(SharedUtils.data.registrationFilteredList);
             ChartUtils.propulsion.motorTypesAnnualDiff100.update(SharedUtils.data.registrationFilteredList100);
     
             // GridUtils.ranking.topResults.update(SharedUtils.data.registrationFilteredList);
         });
    }
}

window.propulsion = propulsion;