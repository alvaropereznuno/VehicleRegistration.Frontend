import SharedUtils from './utils/sharedUtils.js';
import DICT from './configurations/dict.js';

$(document).ready(async () => {
    await index.initialize();
});

const index = {
    currentScript: null,
    
    initialize: async function () {
        index.loadingFilter(false);
        index.loadingScreen(true);
        $("#sectionFilterDesktop").addClass("d-none");
        $("#sectionFilterMobile").addClass("d-none");
        $("#filterSection").hide();

        $("#datePeriod").val(4);
        $("#datePeriodMobile").val(4);

        let isLastVersion = await SharedUtils.isLastVersion();
        await Promise.all([
            SharedUtils.loadModels(!isLastVersion),
            SharedUtils.loadBrands(!isLastVersion),
            SharedUtils.loadRegistrations('2020-01-01', null, !isLastVersion)
        ]);
        filters.initializeFilters();
        
        const [registrationDateFrom, registrationDateTo] = filters.getPeriodDates(4);
        SharedUtils.filterRegistrations(registrationDateFrom, registrationDateTo, [], [], [], [], []);

        loadPage('home.html','home.js');
        this.loadingScreen(false);
    },
    loadPage: function (page, jsFile = null) {
        // Eliminar el contenido HTML actual
        const contentElement = document.getElementById('content');
        contentElement.innerHTML = '';

        // Eliminar el script actual si existe
        if (this.currentScript) {
            this.currentScript.remove();
        }

        // Cargar la nueva página
        fetch(page)
            .then(response => {
                if (!response.ok) throw new Error('Página no encontrada');
                return response.text();
            })
            .then(html => {
                // Insertar el contenido HTML en el contenedor
                contentElement.innerHTML = html;

                // Cargar el nuevo script como módulo
                if (jsFile) {
                    const script = document.createElement('script');
                    script.type = 'module';
                    script.src = jsFile;
                    script.onload = () => {
                        // Verificar si la función `home.initialize()` está disponible y ejecutarla
                        if (jsFile == "home.js" &&typeof home !== 'undefined' && typeof home.initialize === 'function') {
                            $("#sectionFilterDesktop").addClass("d-none");
                            $("#sectionFilterMobile").addClass("d-none");
                            home.initialize();
                        }
                        // Verificar si la función `ranking.initialize()` está disponible y ejecutarla
                        if (jsFile == "ranking.js" && typeof ranking !== 'undefined' && typeof ranking.initialize === 'function') {
                            $("#sectionFilterDesktop").removeClass("d-none");
                            $("#sectionFilterMobile").removeClass("d-none");
                            ranking.initialize();
                        }
                        // Verificar si la función `ranking.initialize()` está disponible y ejecutarla
                        if (jsFile == "annuals.js" &&typeof annuals !== 'undefined' && typeof annuals.initialize === 'function') {
                            $("#sectionFilterDesktop").removeClass("d-none");
                            $("#sectionFilterMobile").removeClass("d-none");
                            annuals.initialize();
                        }
                        // Verificar si la función `propulsion.initialize()` está disponible y ejecutarla
                        if (jsFile == "propulsion.js" &&typeof propulsion !== 'undefined' && typeof propulsion.initialize === 'function') {
                            $("#sectionFilterDesktop").removeClass("d-none");
                            $("#sectionFilterMobile").removeClass("d-none");
                            propulsion.initialize();
                        }
                    };
                    document.body.appendChild(script);

                    // Guardar referencia al script cargado
                    this.currentScript = script;
                }

            })
            .catch(error => {
                contentElement.innerHTML = `<p>Error: ${error.message}</p>`;
            });
    },
    events: {
    },
    loadingScreen: function(visible){
        const loadingScreen = $("#loading")[0];
        if (visible) {
            loadingScreen.style.display = "flex";
        } else {
            loadingScreen.style.display = "none";
        }
    },
    loadingFilter: function(visible){
        const loadingFilter = $("#loadingFilter")[0];
        if (visible) {
            loadingFilter.style.display = "flex";
        } else {
            loadingFilter.style.display = "none";
        }
    },
    toggleFilterSection: function() {
        const filterSection = $("#filterSection");
        $("#filterSection").slideToggle(300);

    }
};

const filters = {
    choiceBrands: null,
    choiceModels: null,
    choiceMotorTypes: null,
    choiceServiceTypes: null,
    choiceCommunities: null,
    choiceProvinces: null,

    initializeFilters: function(){
        // Filtro de Marcas
        this.choiceBrands = new Choices("#brands", {
            removeItemButton: true,
            searchEnabled: true,
            placeholder: true,
            placeholderValue: "Marcas ...",
            loadingText: 'Cargando ...',
            noResultsText: 'No se han encontrado marcas',
            noChoicesText: 'No hay marcas a elegir',
            itemSelectText: 'Selecciona',
        });
        // Filtro de Modelos
        this.choiceModels = new Choices("#models", {
            removeItemButton: true,
            searchEnabled: true,
            placeholder: true,
            placeholderValue: "Modelos ...",
            loadingText: 'Cargando ...',
            noResultsText: 'No se han encontrado modelos',
            noChoicesText: 'Selecciona alguna marca',
            itemSelectText: 'Selecciona',
        });
        // Filtro de Tipos de motor
        this.choiceMotorTypes = new Choices("#motorTypes", {
            removeItemButton: true,
            searchEnabled: false,
            placeholder: true,
            placeholderValue: "Tipos de motor ...",
            loadingText: 'Cargando ...',
            noResultsText: 'No se han encontrado tipos de motor',
            noChoicesText: 'No hay tipos de motores a elegir',
            itemSelectText: 'Selecciona',
        });
        // Filtro de Tipos de vehículo
        this.choiceServiceTypes = new Choices("#serviceTypes", {
            removeItemButton: true,
            searchEnabled: false,
            placeholder: true,
            placeholderValue: "Tipos de servicio ...",
            loadingText: 'Cargando ...',
            noResultsText: 'No se han encontrado tipos de servicios',
            noChoicesText: 'No hay tipos de servicios a elegir',
            itemSelectText: 'Selecciona',
        });
        // Filtro de Comunidades Autónomas
        this.choiceCommunities = new Choices("#communities", {
            removeItemButton: true,
            searchEnabled: true,
            placeholder: true,
            placeholderValue: "CCAA ...",
            loadingText: 'Cargando ...',
            noResultsText: 'No se han encontrado CCAA',
            noChoicesText: 'No hay CCAA a elegir',
            itemSelectText: 'Selecciona',
        });
        // Filtro de Provincias
        this.choiceProvinces = new Choices("#provinces", {
            removeItemButton: true,
            searchEnabled: true,
            placeholder: true,
            placeholderValue: "Provincias ...",
            loadingText: 'Cargando ...',
            noResultsText: 'No se han encontrado provincias',
            noChoicesText: 'No hay provincias a elegir',
            itemSelectText: 'Selecciona'
        });

        document.getElementById("brands").addEventListener("change", this.updateModels);
        document.getElementById("communities").addEventListener("change", this.updateProvinces);
        
        document.getElementById("brands").addEventListener("change", this.filterRegistrations);
        document.getElementById("models").addEventListener("change", this.filterRegistrations);
        document.getElementById("motorTypes").addEventListener("change", this.filterRegistrations);
        document.getElementById("serviceTypes").addEventListener("change", this.filterRegistrations);
        document.getElementById("communities").addEventListener("change", this.filterRegistrations);
        document.getElementById("provinces").addEventListener("change", this.filterRegistrations);

        document.getElementById("datePeriod").addEventListener("change", this.filterRegistrations);
        document.getElementById("datePeriodMobile").addEventListener("change", this.filterRegistrations);

        this.populateFilters();
    },
    populateFilters(){
        this.populateChoice(this.choiceBrands, SharedUtils.data.brandList);
        this.populateChoice(this.choiceModels, []);
        this.populateChoice(this.choiceMotorTypes, DICT.MOTOR_TYPES);
        this.populateChoice(this.choiceServiceTypes, DICT.SERVICE_TYPES);
        this.populateChoice(this.choiceCommunities, DICT.COMMUNITIES);
        this.populateChoice(this.choiceProvinces, DICT.PROVINCES);
    },
    populateSelect: function(selectId, data, valueKey = "id", textKey = "description") {
        const select = document.getElementById(selectId);
        if (!select) return;

        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item[valueKey];
            option.textContent = item[textKey];
            select.appendChild(option);
        });
    },
    populateChoice: function(choise, list){
        // Limpiar y actualizar lista en el combobox
        choise.clearChoices();
        choise.setChoices(list.map(l => ({
            value: l.id,
            label: l.description
        })), 'value', 'label', true);
    },
    updateProvinces: function() {
        const selectedCommunities = Array.from(document.getElementById("communities").selectedOptions).map(option => parseInt(option.value));

        let filteredProvinces = DICT.PROVINCES;
        if (selectedCommunities.length > 0)
        {
            filteredProvinces = Array.from(filteredProvinces).filter(province => selectedCommunities.includes(province.communityId));
            
            const selectedProvinces = filters.choiceProvinces.getValue(true);
            const validSelectedProvinces = selectedProvinces.filter(m => filteredProvinces.some(mm => mm.id === m));
            
            if (selectedProvinces.length > 0) {
                // filters.choiceModels.clearStore();
                selectedProvinces.forEach(sm => {
                    if (!validSelectedProvinces.includes(sm)) {
                        filters.choiceProvinces.removeActiveItemsByValue(sm);
                    }
                });
            }
        }else {
            filters.choiceProvinces.hideDropdown();
        }

        filters.populateChoice(filters.choiceProvinces, filteredProvinces);
    },
    updateModels: function() {
        const selectedBrands = Array.from(document.getElementById("brands").selectedOptions).map(option => parseInt(option.value));

        let filteredModels = SharedUtils.data.modelList;
        if (selectedBrands.length > 0){
            filteredModels = Array.from(filteredModels).filter(model => selectedBrands.includes(model.brandId));
            
            const selectedModels = filters.choiceModels.getValue(true);
            const validSelectedModels = selectedModels.filter(m => filteredModels.some(mm => mm.id === m));
            
            if (selectedModels.length > 0) {
                // filters.choiceModels.clearStore();
                selectedModels.forEach(sm => {
                    if (!validSelectedModels.includes(sm)) {
                        filters.choiceModels.removeActiveItemsByValue(sm);
                    }
                });
            }

            filters.choiceModels.enable();
            filters.populateChoice(filters.choiceModels, filteredModels);
        } else {
            filters.choiceModels.clearStore();
            filters.choiceModels.hideDropdown();
            filters.populateChoice(filters.choiceModels, []);
        }
    },
    filterRegistrations: function() {
        index.loadingFilter(true);

        const newValue = $(this).val();
        if (this.id === "datePeriod") $("#datePeriodMobile").val(newValue);
        if (this.id === "datePeriodMobile") $("#datePeriod").val(newValue);

        setTimeout(() => {
            const [registrationDateFrom, registrationDateTo] = filters.getPeriodDates(document.getElementById("datePeriod").value);
            const brandIdList = Array.from(document.getElementById("brands").selectedOptions).map(option => parseInt(option.value));;
            let modelIdList = Array.from(document.getElementById("models").selectedOptions).map(option => parseInt(option.value));
            const motorTypeIdList = Array.from(document.getElementById("motorTypes").selectedOptions).map(option => parseInt(option.value));
            const serviceTypeIdList = Array.from(document.getElementById("serviceTypes").selectedOptions).map(option => parseInt(option.value));
            const communityIdList = Array.from(document.getElementById("communities").selectedOptions).map(option => parseInt(option.value));
            let provinceIdList = Array.from(document.getElementById("provinces").selectedOptions).map(option => parseInt(option.value));

            if (modelIdList.length === 0 && brandIdList.length > 0)
                modelIdList = Array.from(SharedUtils.data.modelList).filter(model => brandIdList.includes(model.brandId)).map(m => m.id);
            if (provinceIdList.length === 0 && communityIdList.length > 0)
                provinceIdList = Array.from(DICT.PROVINCES).filter(province => communityIdList.includes(province.communityId)).map(m => m.id);

            SharedUtils.filterRegistrations(registrationDateFrom, registrationDateTo, brandIdList, modelIdList, motorTypeIdList, serviceTypeIdList, provinceIdList);
            
            index.loadingFilter(false);
        }, 0);
    },
    getPeriodDates: function(period) {
        const now = new Date();
        let startDate, endDate;
        switch (period) {
            case '1': case 1: // Último mes
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                break;
            case '2': case 2: // Últimos 3 meses
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                break;
            case '3': case 3: // Año actual
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                break;
            case '4': case 4: // Últimos 3 años
                startDate = new Date(now.getFullYear() - 3, 0, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        }

        return [startDate, endDate];
    }
}

window.loadPage = index.loadPage.bind(index);
window.toggleFilterSection = index.toggleFilterSection.bind(index);
