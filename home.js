import ChartUtils from './utils/chartUtils.js';
import GridUtils from './utils/gridUtils.js';
import SharedUtils from './utils/sharedUtils.js';

const home = {
    initialize: async function (){
        // await ChartUtils.home.propulsion.create(SharedUtils.data.registrationFilteredSimpleList, $('#propulsionChart'));
        await GridUtils.home.leadershipRanking.create(SharedUtils.data.registrationFilteredSimpleList, document.getElementById('leadershipRanking'));
        await GridUtils.home.winnersAndLoosers.create(SharedUtils.data.registrationFilteredSimpleList, document.getElementById('winnersAndLoosers'));

        window.addEventListener("globalDataUpdated", async () => {
            clearTimeout(window._gridUpdateTimeout);
            
            window._gridUpdateTimeout = setTimeout(async () => {
                await GridUtils.home.leadershipRanking.create(SharedUtils.data.registrationFilteredSimpleList, document.getElementById('leadershipRanking'));
                await GridUtils.home.winnersAndLoosers.create(SharedUtils.data.registrationFilteredSimpleList, document.getElementById('winnersAndLoosers'));
            }, 150);
        });
    }
}

window.home = home;