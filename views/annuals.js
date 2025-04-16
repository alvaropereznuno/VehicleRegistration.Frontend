import ChartUtils from '../utils/chartUtils.js';
import GridUtils from '../utils/gridUtils.js';
import SharedUtils from '../utils/sharedUtils.js';

/*$(document).ready(async () => {
    await ranking.initialize();
});*/

const annuals = {
    initialize: async function (){
        await ChartUtils.annuals.annualSellings.create(SharedUtils.data.registrationList, $('#annuals'));

        await GridUtils.annuals.annualSellings.create(SharedUtils.data.registrationList, document.getElementById('annualsResults'));
    }
}

window.annuals = annuals;