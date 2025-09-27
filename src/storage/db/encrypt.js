
import { table, pickFields } from "./schema";
let cryptoKey;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Import cryptoKey
export const importCryptoKey = async (key) => {
    let rawKey;
    if (typeof atob === "function") {
        const binary = atob(key);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        rawKey = bytes.buffer;
    } else {
        const buf = Buffer.from(key, 'base64');
        rawKey = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    cryptoKey = await crypto.subtle.importKey(
        "raw", rawKey,
        { name: "AES-GCM" },
        true,
        ["encrypt", "decrypt"]
    )
};

// Encrypt data
export const encryptData = async (type, data) => {
    // Get table index entries
    const indexFields = table[type];
    const newData = pickFields(data, indexFields);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const dataEncrypt = encoder.encode(JSON.stringify(data));
    const encryptedData = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        cryptoKey,
        dataEncrypt
    );
    newData.iv = iv;
    newData.encryptedData = encryptedData;
    return newData;
};

// Encrypt dataArr
export const encryptDataArr = async (type, dataArr) => {
    const newDataArr = [];
    // Get table index entries
    const indexFields = table[type];
    for (const data of dataArr) {
        const newData = pickFields(data, indexFields);
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const dataEncrypt = encoder.encode(JSON.stringify(data));
        const encryptedData = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            cryptoKey,
            dataEncrypt
        );
        newData.iv = iv;
        newData.encryptedData = encryptedData;
        newDataArr.push(newData);
    }
    return newDataArr;
};

// Decrypt data
export const decryptData = async (data) => {
    if (!data) {
        return
    }
    const { iv, encryptedData } = data;
    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        cryptoKey,
        encryptedData
    )
    return JSON.parse(decoder.decode(decrypted));
};

// Decrypt data array
export const decryptDataArr = async (dataArr) => {
    if (!dataArr) {
        return
    }
    const newDataArr = [];
    for (const data of dataArr) {
        const { iv, encryptedData } = data;
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            cryptoKey,
            encryptedData
        )
        const decodedData = decoder.decode(decrypted);
        newDataArr.push(JSON.parse(decodedData));
    }
    return newDataArr;
};