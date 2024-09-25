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

export function convertToAmPm(time) {
    const [hour, minute] = time.split(':').map(Number);

    let ampm = hour >= 12 ? 'PM' : 'AM';
    let formattedHour = hour % 12 || 12; // Convert 0 hour to 12 for AM/PM display

    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
}
