const BASE_URL = 'https://localhost:7230/Registration';
// const BASE_URL = 'https://vehicleregistrationsapirest-e0e5fjagbmc7hwfp.spaincentral-01.azurewebsites.net/Registration';

// SaveRegistrations
export async function saveRegistrations(file) {
    const url = new URL(`${BASE_URL}/SaveRegistrations`);

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
    } catch (error) {
        throw error;
    }
}

// SaveRegistrations
export async function setOptimization() {
    const url = new URL(`${BASE_URL}/SetOptimization`);

    try {
        const response = await fetch(url.toString(), {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
    } catch (error) {
        throw error;
    }
}

// SetModelSynonyms
export async function setModelSynonyms(modelSynonyms) {
    const url = new URL(`${BASE_URL}/SetModelSynonyms`);

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(modelSynonyms)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
    } catch (error) {
        throw error;
    }
}

// SetBrandSynonyms
export async function setBrandSynonyms(brandSynonyms) {
    const url = new URL(`${BASE_URL}/SetBrandSynonyms`);

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(brandSynonyms)
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
    } catch (error) {
        throw error;
    }
}