import SharedUtils from '../utils/sharedUtils.js';

$(document).ready(async () => {
    await home.initialize();
});

const home = {
    currentScript: null,
    initialize: async function () {
        await Promise.all([
            SharedUtils.loadModels(),
            SharedUtils.loadBrands(),
            SharedUtils.loadRegistrations('2020-01-01')
        ]);
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
    }
}

window.loadPage = home.loadPage.bind(home);