const DB_NAME = 'indexData';
const STORE_NAME = 'storeData';

// Inicializar la base de datos
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

// Obtener datos de IndexedDB
export async function getIndexedData(dataName) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(dataName);

        request.onsuccess = () => {
            if (request.result != undefined)
            {
                let result = request.result; //.map(item => new DataModel(item.date, item.brandId, item.brandName, item.modelId, item.modelName, item.provinceId, item.provinceName, item.type, item.typeName, item.count));
                resolve(result || null);
            }
            else
            {
                resolve(null);
            }
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}

// Guardar datos en IndexedDB
export async function setIndexedData(dataName, data) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(data, dataName);

        request.onsuccess = () => {
            resolve(true);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}
