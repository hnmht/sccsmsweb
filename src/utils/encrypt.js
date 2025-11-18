import forge from "node-forge";
export const encryptPassword = (publicKey, text) => {
    const rsa = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = rsa.encrypt(text, "RSAES-PKCS1-V1_5");
    return forge.util.encode64(encrypted).toString();
};