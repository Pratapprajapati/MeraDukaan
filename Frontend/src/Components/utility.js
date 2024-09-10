import CryptoJS from "crypto-js";
import Cookie from "js-cookie"

export function decrypt() {
    const vendorCrypt = Cookie.get('user')
    
    if (vendorCrypt) {
        const bytes = CryptoJS.AES.decrypt(vendorCrypt, 'secretKey');
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData
    } else {
        return null
    }
}