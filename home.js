import ChartUtils from './utils/chartUtils.js';
import SharedUtils from './utils/sharedUtils.js';

const home = {
    initialize: async function (){
        await Promise.all([
            ChartUtils.home.ranking.create(SharedUtils.data.registrationList, $('#rankingChart')),
            ChartUtils.home.annuals.create(SharedUtils.data.registrationList, $('#annualsChart')),
            ChartUtils.home.propulsion.create(SharedUtils.data.registrationList, $('#propulsionChart'))
        ]);
    }
}

window.home = home;