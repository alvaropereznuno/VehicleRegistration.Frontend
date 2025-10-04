import ChartUtils from './utils/chartUtils.js';
import GridUtils from './utils/gridUtils.js';
import SharedUtils from './utils/sharedUtils.js';

const trends = {
    start: function(){
        $("#brandGrowthMoMLoading").show();
        $("#brandGrowthYoYLoading").show();
        $("#brandDominationLoading").show();
        $("#brandDominationGrowthLoading").show();

        $("#brandGrowthMoM").hide();
        $("#brandGrowthYoY").hide();
        $("#brandDomination").hide();
        $("#brandDominationGrowth").hide();
    },
    initialize: async function (){
        await Promise.all([
            trends.customPresentation(),

            ChartUtils.trends.brandGrowthMoM.create(SharedUtils.data.registrationFilteredNoDateList, $('#brandGrowthMoM')),
            ChartUtils.trends.brandGrowthYoY.create(SharedUtils.data.registrationFilteredNoDateList, $('#brandGrowthYoY')),
            ChartUtils.trends.brandDomination.create(SharedUtils.data.registrationFilteredList, $('#brandDomination')),
            ChartUtils.trends.brandDominationGrowth.create(SharedUtils.data.registrationFilteredList, $('#brandDominationGrowth')),
        ]);

        $("#brandGrowthMoMLoading").hide();
        $("#brandGrowthYoYLoading").hide();
        $("#brandDominationLoading").hide();
        $("#brandDominationGrowthLoading").hide();

        $("#brandGrowthMoM").show();
        $("#brandGrowthYoY").show();
        $("#brandDomination").show();
        $("#brandDominationGrowth").show();
        
        // GridUtils.ranking.topResults.create(SharedUtils.data.registrationFilteredList, document.getElementById('topResults'));

        window.addEventListener("globalDataUpdated", async () => {
            await Promise.all([
                trends.customPresentation(),

                ChartUtils.trends.brandGrowthMoM.update(SharedUtils.data.registrationFilteredNoDateList),
                ChartUtils.trends.brandGrowthYoY.update(SharedUtils.data.registrationFilteredNoDateList),
                ChartUtils.trends.brandDomination.update(SharedUtils.data.registrationFilteredNoDateList),
                ChartUtils.trends.brandDominationGrowth.update(SharedUtils.data.registrationFilteredNoDateList),
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