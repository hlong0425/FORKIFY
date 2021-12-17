import { TIMEOUT_SET } from "./config";
import { uploadRecipe } from "./model";


const timeout = function (sec) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error(`Request took too long! Timeout after ${sec} seconds`));
        }, sec * 1000);
    })
}


export const getJSON = async function (url) {
    try {
        const respone = await Promise.race([fetch(url), timeout(TIMEOUT_SET)]);
        const data = await respone.json();
        if (!respone.ok) throw new Error(`${data.message} ${res.status}`);
        return data;
    }
    catch (err) {
        throw new Error(err);
    }
}

export const sendJSON = async function (url, uploadData) {
    const fetchPro = fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'appLication/json',
        },
        body: JSON.stringify(uploadData),
    });

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SET)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data;
}


