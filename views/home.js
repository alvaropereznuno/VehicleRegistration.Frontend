import SharedUtils from '../utils/sharedUtils.js';
import DICT from '../configurations/dict.js';

$(document).ready(async () => {
    await home.initialize();
});

const home = {
    currentScript: null,
    initialize: async function () {
        home.loadingScreen(true);

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
        filterSection.toggleClass("d-none");
    }
};

const filters = {
    choiceBrands: null,
    choiceModels: null,
    choiceMotorTypes: null,
    choiceVehicleTypes: null,
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
        this.choiceVehicleTypes = new Choices("#vehicleTypes", {
            removeItemButton: true,
            searchEnabled: false,
            placeholder: true,
            placeholderValue: "Tipos de vehículo ...",
            loadingText: 'Cargando ...',
            noResultsText: 'No se han encontrado tipos de vehículos',
            noChoicesText: 'No hay tipos de vehículos a elegir',
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

        this.populateFilters();
    },
    populateFilters(){
        this.populateChoice(this.choiceBrands, SharedUtils.data.brandList);
        this.populateChoice(this.choiceModels, SharedUtils.data.modelList);
        this.populateChoice(this.choiceMotorTypes, DICT.MOTOR_TYPES);
        this.populateChoice(this.choiceVehicleTypes, DICT.VEHICLE_TYPES);
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

        // Filtrar provincias según las comunidades seleccionadas
        const filteredProvinces = DICT.PROVINCES.filter(province => selectedCommunities.includes(province.communityId));

        // Limpiar y actualizar provincias en el combobox
        filters.populateChoice(filters.choiceProvinces, filteredProvinces);
    },
    updateModels: function() {
        const selectedBrands = Array.from(document.getElementById("brands").selectedOptions).map(option => parseInt(option.value));

        // Filtrar provincias según las marcas
        const filteredModels = SharedUtils.data.modelList.filter(model => selectedBrands.includes(model.brandId));

        // Limpiar y actualizar provincias en el combobox
        filters.populateChoice(filters.choiceModels, filteredModels);
    },
}

window.loadPage = home.loadPage.bind(home);
window.toggleFilterSection = home.toggleFilterSection.bind(home);
