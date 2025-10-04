import ChartUtils from './utils/chartUtils.js';
import GridUtils from './utils/gridUtils.js';
import SharedUtils from './utils/sharedUtils.js';

const trends = {
    initialize: async function (){
        await Promise.all([
            trends.customPresentation(),

            ChartUtils.trends.brandGrowthMoM.create(SharedUtils.data.registrationFilteredList, $('#brandGrowthMoM')),
            ChartUtils.trends.brandGrowthYoY.create(SharedUtils.data.registrationFilteredList, $('#brandGrowthYoY')),

            // ChartUtils.trends.domination100.create(SharedUtils.data.registrationFilteredList, $('#domination100')),
        ]);
        
        // GridUtils.ranking.topResults.create(SharedUtils.data.registrationFilteredList, document.getElementById('topResults'));

        window.addEventListener("globalDataUpdated", async () => {
            await Promise.all([
                trends.customPresentation(),

                ChartUtils.trends.brandGrowthMoM.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.trends.brandGrowthYoY.update(SharedUtils.data.registrationFilteredList),
                // ChartUtils.trends.domination100.update(SharedUtils.data.registrationFilteredList),
            ]);
             
             // GridUtils.ranking.topResults.update(SharedUtils.data.registrationFilteredList);
         });
    },
    customPresentation: async function(){
        const brandIdList = Array.from(document.getElementById("brands").selectedOptions).map(option => parseInt(option.value));

        if (brandIdList.length > 0 && brandIdList.length <= 5){
            $("#brandGrowthMoMChart").addClass("chart-container-xsmall");
            $("#brandGrowthMoMChart").removeClass("chart-container-small");
            $("#brandGrowthMoMChart").removeClass("chart-container-medium");
            $("#brandGrowthMoMChart").removeClass("chart-container-large");

            $("#brandGrowthYoYChart").addClass("chart-container-xsmall");
            $("#brandGrowthYoYChart").removeClass("chart-container-small");
            $("#brandGrowthYoYChart").removeClass("chart-container-medium");
            $("#brandGrowthYoYChart").removeClass("chart-container-large");
        } else if (brandIdList.length > 0 && brandIdList.length < 10){
            $("#brandGrowthMoMChart").removeClass("chart-container-xsmall");
            $("#brandGrowthMoMChart").addClass("chart-container-small");
            $("#brandGrowthMoMChart").removeClass("chart-container-medium");
            $("#brandGrowthMoMChart").removeClass("chart-container-large");

            $("#brandGrowthYoYChart").removeClass("chart-container-xsmall");
            $("#brandGrowthYoYChart").addClass("chart-container-small");
            $("#brandGrowthYoYChart").removeClass("chart-container-medium");
            $("#brandGrowthYoYChart").removeClass("chart-container-large");
        } else if (brandIdList.length > 0 && brandIdList.length < 20) {
            $("#brandGrowthMoMChart").removeClass("chart-container-xsmall");
            $("#brandGrowthMoMChart").removeClass("chart-container-small");
            $("#brandGrowthMoMChart").addClass("chart-container-medium");
            $("#brandGrowthMoMChart").removeClass("chart-container-large");

            $("#brandGrowthYoYChart").removeClass("chart-container-xsmall");
            $("#brandGrowthYoYChart").removeClass("chart-container-small");
            $("#brandGrowthYoYChart").addClass("chart-container-medium");
            $("#brandGrowthYoYChart").removeClass("chart-container-large");
        } else {
            $("#brandGrowthMoMChart").removeClass("chart-container-xsmall");
            $("#brandGrowthMoMChart").removeClass("chart-container-small");
            $("#brandGrowthMoMChart").removeClass("chart-container-medium");
            $("#brandGrowthMoMChart").addClass("chart-container-large");

            $("#brandGrowthYoYChart").removeClass("chart-container-xsmall");
            $("#brandGrowthYoYChart").removeClass("chart-container-small");
            $("#brandGrowthYoYChart").removeClass("chart-container-medium");
            $("#brandGrowthYoYChart").addClass("chart-container-large");
        }
    }
}

window.trends = trends;