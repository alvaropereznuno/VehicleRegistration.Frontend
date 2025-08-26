import SharedUtils from './utils/sharedUtils.js';
import DICT from './configurations/dict.js';

$(document).ready(async () => {
    await home.initialize();
});

const home = {
    currentScript: null,
    initialize: async function () {
        home.loadingScreen(true);
        $("#filterSection").hide();

        await Promise.all([
            SharedUtils.loadModels(),
            SharedUtils.loadBrands(),
            SharedUtils.loadRegistrations('2020-01-01')
        ]);

        $('#btnRefresh').click(async () => {
            await this.events.btnRefreshDashboard_click();
        });

        filters.initializeFilters();
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
                        // Verificar si la función `ranking.initialize()` está disponible y ejecutarla
                        if (jsFile == "ranking.js" && typeof ranking !== 'undefined' && typeof ranking.initialize === 'function') {
                            ranking.initialize();
                        }
                        // Verificar si la función `ranking.initialize()` está disponible y ejecutarla
                        if (jsFile == "annuals.js" &&typeof annuals !== 'undefined' && typeof annuals.initialize === 'function') {
                            annuals.initialize();
                        }
                        // Verificar si la función `propulsion.initialize()` está disponible y ejecutarla
                        if (jsFile == "propulsion.js" &&typeof propulsion !== 'undefined' && typeof propulsion.initialize === 'function') {
                            propulsion.initialize();
                        }
                    };
                    document.body.appendChild(script);

                    // Guardar referencia al script cargado
                    this.currentScript = script;
                }

                $("#btnFilter").removeClass("d-none");
            })
            .catch(error => {
                contentElement.innerHTML = `<p>Error: ${error.message}</p>`;
            });
    },
    events: {
        btnRefreshDashboard_click: async function () {
            home.loadingScreen(true);
        
            await Promise.all([
                SharedUtils.loadModels(true),
                SharedUtils.loadBrands(true),
                SharedUtils.loadRegistrations('2020-01-01', null, true)
            ]);
        
            home.loadingScreen(false);
        }
    },
    loadingScreen: function(visible){
        const loadingScreen = $("#loading")[0];
        if (visible) {
            loadingScreen.style.display = "flex";
        } else {
            loadingScreen.style.display = "none";
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
            noChoicesText: 'No hay modelos a elegir',
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
            placeholderValue: "Comunidades autónomas ...",
            loadingText: 'Cargando ...',
            noResultsText: 'No se han encontrado comunidades autónomas',
            noChoicesText: 'No hay comunidades autónomas a elegir',
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
        document.getElementById("dateFrom").addEventListener("change", this.filterRegistrations);
        document.getElementById("dateTo").addEventListener("change", this.filterRegistrations);

        this.populateFilters();
    },
    populateFilters(){
        this.populateChoice(this.choiceBrands, SharedUtils.data.brandList);
        this.populateChoice(this.choiceModels, SharedUtils.data.modelList);
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
            filteredProvinces = Array.from(filteredProvinces).filter(province => selectedCommunities.includes(province.communityId));

        filters.populateChoice(filters.choiceProvinces, filteredProvinces);
    },
    updateModels: function() {
        const selectedBrands = Array.from(document.getElementById("brands").selectedOptions).map(option => parseInt(option.value));

        let filteredModels = SharedUtils.data.modelList;
        if (selectedBrands.length > 0)
            filteredModels = Array.from(filteredModels).filter(model => selectedBrands.includes(model.brandId));

        filters.populateChoice(filters.choiceModels, filteredModels);
    },
    filterRegistrations: function(){
        const [yearFrom, monthFrom] = document.getElementById("dateFrom").value.split("-").map(Number);
        const registrationDateFrom = new Date(yearFrom, monthFrom - 1, 1);
        const [yearTo, monthTo] = document.getElementById("dateTo").value.split("-").map(Number);
        const registrationDateTo = new Date(yearTo, monthTo - 1, 1);
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
    }
}

window.loadPage = home.loadPage.bind(home);
window.toggleFilterSection = home.toggleFilterSection.bind(home);
