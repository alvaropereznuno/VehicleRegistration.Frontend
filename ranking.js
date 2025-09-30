import ChartUtils from './utils/chartUtils.js';
import GridUtils from './utils/gridUtils.js';
import SharedUtils from './utils/sharedUtils.js';

/*$(document).ready(async () => {
    await ranking.initialize();
});*/
const start = {

}

const ranking = {
    start: function(){
        $("#topBrandsLoading").show();
        $("#topModelsLoading").show();
        $("#topBrandsAccLoading").show();
        $("#topModelsAccLoading").show();

        $("#topBrands").hide();
        $("#topModels").hide();
        $("#topBrandsAcc").hide();
        $("#topModelsAcc").hide();
    },
    initialize: async function (){
        $("#topBrands").hide();
        await Promise.all([
            ranking.customPresentation(),

            ChartUtils.ranking.topBrands.create(SharedUtils.data.registrationFilteredList, $('#topBrands')),
            ChartUtils.ranking.topModels.create(SharedUtils.data.registrationFilteredList, $('#topModels')),
            ChartUtils.ranking.topBrandsAcc.create(SharedUtils.data.registrationFilteredList, $('#topBrandsAcc')),
            ChartUtils.ranking.topModelsAcc.create(SharedUtils.data.registrationFilteredList, $('#topModelsAcc')),

            GridUtils.ranking.topResults.create(SharedUtils.data.registrationFilteredList, document.getElementById('topResults'))
        ]);

        $("#topBrandsLoading").hide();
        $("#topModelsLoading").hide();
        $("#topBrandsAccLoading").hide();
        $("#topModelsAccLoading").hide();
        
        $("#topBrands").show();
        $("#topModels").show();
        $("#topBrandsAcc").show();
        $("#topModelsAcc").show();
        
        window.addEventListener("globalDataUpdated", async () => {
            await Promise.all([
                ranking.customPresentation(),

                ChartUtils.ranking.topBrands.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.ranking.topModels.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.ranking.topBrandsAcc.update(SharedUtils.data.registrationFilteredList),
                ChartUtils.ranking.topModelsAcc.update(SharedUtils.data.registrationFilteredList),
        
                GridUtils.ranking.topResults.update(SharedUtils.data.registrationFilteredList)
            ]);
        });
    },
    customPresentation: async function(){
        const brandIdList = Array.from(document.getElementById("brands").selectedOptions).map(option => parseInt(option.value));
        const modelIdList = Array.from(document.getElementById("models").selectedOptions).map(option => parseInt(option.value));

        if (brandIdList.length == 0 || brandIdList.length > 5){
            $("#topBrandsTarjet").show();
            $("#topBrandsAccTarjet").show();
            
            $("#topModelsTarjet").addClass("col-lg-6");
            $("#topModelsAccTarjet").addClass("col-lg-6");

            $("#topBrandsTarjet").addClass("col-lg-6");
            $("#topBrandsAccTarjet").addClass("col-lg-6");

            $("#topBrandsTarjetChart").addClass("chart-container-large");
            $("#topBrandsTarjetChart").removeClass("chart-container-xsmall");
        } else if (brandIdList.length == 1){
            $("#topBrandsTarjet").hide();
            $("#topBrandsAccTarjet").hide();
            
            $("#topModelsTarjet").removeClass("col-lg-6");
            $("#topModelsAccTarjet").removeClass("col-lg-6");

            $("#topBrandsTarjet").addClass("col-lg-6");
            $("#topBrandsAccTarjet").addClass("col-lg-6");

            $("#topBrandsTarjetChart").addClass("chart-container-large");
            $("#topBrandsTarjetChart").removeClass("chart-container-xsmall");
        } else {
            $("#topBrandsTarjet").show();
            $("#topBrandsAccTarjet").show();
            
            $("#topModelsTarjet").removeClass("col-lg-6");
            $("#topModelsAccTarjet").addClass("col-lg-6");

            $("#topBrandsTarjet").removeClass("col-lg-6");
            $("#topBrandsAccTarjet").addClass("col-lg-6");

            $("#topBrandsTarjetChart").removeClass("chart-container-large");
            $("#topBrandsTarjetChart").addClass("chart-container-xsmall");
        }

        if (modelIdList.length == 1){
            $("#topModelsTarjet").hide();

            $("#topModelsTarjetChart").addClass("chart-container-large");
            $("#topModelsTarjetChart").removeClass("chart-container-xsmall");
        } else if (modelIdList.length > 0 && modelIdList.length < 5) {
            $("#topModelsTarjet").show();

            $("#topModelsTarjetChart").removeClass("chart-container-large");
            $("#topModelsTarjetChart").addClass("chart-container-xsmall");
        } else {
            $("#topModelsTarjet").show();

            $("#topModelsTarjetChart").addClass("chart-container-large");
            $("#topModelsTarjetChart").removeClass("chart-container-xsmall");
        }
    }
}

window.ranking = ranking;