import ChartUtils from './utils/chartUtils.js';
import GridUtils from './utils/gridUtils.js';
import SharedUtils from './utils/sharedUtils.js';

const propulsion = {
    initialize: async function (){
        ChartUtils.propulsion.motorTypesAcc.create(SharedUtils.data.registrationFilteredList, $('#motorTypesAcc'));
        ChartUtils.propulsion.motorTypesPie.create(SharedUtils.data.registrationFilteredList, $('#motorTypesPie'));

        // GridUtils.ranking.topResults.create(SharedUtils.data.registrationFilteredList, document.getElementById('topResults'));

        window.addEventListener("globalDataUpdated", () => {
             ChartUtils.propulsion.motorTypesAcc.update(SharedUtils.data.registrationFilteredList);
             ChartUtils.propulsion.motorTypesPie.update(SharedUtils.data.registrationFilteredList);
     
             // GridUtils.ranking.topResults.update(SharedUtils.data.registrationFilteredList);
         });
    }
}

window.propulsion = propulsion;