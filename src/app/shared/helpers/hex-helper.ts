export class HexHelper {
    public static a2hex(str) {
        let arr = [];
        for (let i = 0, l = str.length; i < l; i++) {
            let hex = Number(str.charCodeAt(i)).toString(16);
            arr.push(hex);
        }
        return arr.join("");
    }
    public static hex2a(hexx) {
        let hex = hexx.toString(); //force conversion
        let str = "";
        for (let i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
}
