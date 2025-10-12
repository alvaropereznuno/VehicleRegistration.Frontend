import GridUtils from './utils/gridUtils.js';
import SharedUtils from './utils/sharedUtils.js';

const home = {
    initialize: async function (){
        await GridUtils.home.leadershipRanking.create(SharedUtils.data.registrationFilteredSimpleList, document.getElementById('leadershipRanking'));
        await GridUtils.home.winnersAndLoosers.create(SharedUtils.data.registrationFilteredSimpleList, document.getElementById('winnersAndLoosers'));
        await GridUtils.home.newPromises.create(SharedUtils.data.registrationFilteredSimpleList, document.getElementById('newPromises'));

        window.addEventListener("globalDataUpdated", async () => {
            clearTimeout(window._gridUpdateTimeout);

            window._gridUpdateTimeout = setTimeout(async () => {
                await GridUtils.home.leadershipRanking.create(SharedUtils.data.registrationFilteredSimpleList, document.getElementById('leadershipRanking'));
                await GridUtils.home.winnersAndLoosers.create(SharedUtils.data.registrationFilteredSimpleList, document.getElementById('winnersAndLoosers'));
                await GridUtils.home.newPromises.create(SharedUtils.data.registrationFilteredSimpleList, document.getElementById('newPromises'));
            }, 200);
        });
    }
}

window.home = home;